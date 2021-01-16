sap.ui.define(
    [
        "./BaseController",
        "sap/ui/Shop/controller/mixins/changeProductTable",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Sorter",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/Shop/controller/utils/formatter",
    ],
    function (
        BaseController,
        changeProductTable,
        Fragment,
        Filter,
        FilterOperator,
        Sorter,
        MessageToast,
        MessageBox,
        formatter
    ) {
        "use strict";
        return BaseController.extend(
            "sap.ui.Shop.controller.ProductList",

            jQuery.extend(changeProductTable, {
                formatter: formatter,
                /**
                 * Controller's "init" lifecycle method.
                 */
                onInit: function () {
                    var oView = this.getView(),
                        oMessageManager = this.getMessageManager();

                    // Route
                    this.getRouterForThis()
                        .getRoute("ProductList")
                        .attachPatternMatched(this._onObjectMatched, this);

                    // Validation
                    oView.setModel(
                        oMessageManager.getMessageModel(),
                        "message"
                    );
                    oMessageManager.registerObject(oView, true);
                },

                /**
                 *  Bind context to the view.
                 *  @private
                 *  @param {sap.ui.base.Event} oEvent event object.
                 *  @return {void}
                 */
                _onObjectMatched: function (oEvent) {
                    var oModel = this.getModel("State"),
                        sCategoriesURL = oEvent.getParameter("arguments")
                            .sCategoriesURL;

                    this.getView().bindElement({
                        path: "/" + sCategoriesURL,
                    });

                    oModel.setProperty("/State/isNavBackButton", true);
                },

                /**
                 *  This method navigates to supplier.
                 *  @public
                 *  @param {sap.ui.base.Event} oEvent event object.
                 *  @return {void}
                 */
                onNavToSuppliers: function (oEvent) {
                    var oSelectedListItem = oEvent.getSource(),
                        oRouter = this.getRouterForThis(),
                        sProductURL = oSelectedListItem
                            .getBindingContext()
                            .getPath()
                            .substr(1);

                    oRouter.navTo("Supplier", {
                        sProductURL: sProductURL,
                    });
                },

                /**
                 * "Edit Product" button press event handler.
                 *  This method changes page to edit mode.
                 *  @public
                 *  @return {void}
                 */
                onEditProduct: function () {
                    var oModel = this.getModel(),
                        aDeferredGroups = this.getModel()
                            .getDeferredGroups()
                            .concat(["CancelChangeCategory"]);

                    this.getModel("State").setProperty(
                        "/State/isEditProduct",
                        true
                    );
                    // set Deferred Groups
                    oModel.setDeferredGroups(aDeferredGroups);
                    this.aBatchRequest = [];
                },

                /**
                 * Save button press event handler.
                 * @public
                 * @return {void}
                 */
                onSaveChangesPress: function () {
                    var oModel = this.getModel(),
                        sMessage = this.getI18nWord("categoryChanged"),
                        nValidationError = this.getMessageManager()
                            .getMessageModel()
                            .getData().length;

                    if (nValidationError === 0) {
                        this.getModel("State").setProperty(
                            "/State/isEditProduct",
                            false
                        );

                        oModel.resetChanges(["/Products"], true);
                        oModel.submitChanges();
                        MessageToast.show(sMessage);
                    }
                },

                /**
                 * This method opens cancel popover.
                 * @public
                 * @param {sap.ui.base.Event} oEvent event object.
                 * @return {void}
                 */
                onCancelConfirmOpen: function (oEvent) {
                    var oButton = oEvent.getSource(),
                        oView = this.getView(),
                        oPopover = this.byId("CancelPopover");

                    // create popover
                    if (!oPopover) {
                        Fragment.load({
                            id: oView.getId(),
                            name:
                                "sap.ui.Shop.view.fragments.ProductList.ProductListCancelEditPopover",
                            controller: this,
                        }).then(function (oPopover) {
                            oView.addDependent(oPopover);
                            oPopover.openBy(oButton);
                        });
                    } else {
                        oPopover.openBy(oButton);
                    }
                },

                /**
                 * Cancel button press event handler.
                 * This method cancels editing of product.
                 * @public
                 * @return {void}
                 */
                onDiscardChangesPress: function () {
                    var oModel = this.getModel(),
                        oProductListItems = this.byId(
                            "ProductListTable"
                        ).getBinding("items");

                    this.getModel("State").setProperty(
                        "/State/isEditProduct",
                        false
                    );

                    this._createBatchRequest();
                    oModel.submitChanges({
                        groupId: "CancelChangeCategory",
                        success: oProductListItems.refresh(true),
                    });
                    this.getModel().resetChanges();
                },

                /**
                 * This method open error popover.
                 * @public
                 * @param {sap.ui.base.Event} oEvent event object.
                 * @return {void}
                 */
                onMessagePopoverPress: function (oEvent) {
                    var oButton = oEvent.getSource(),
                        oView = this.getView(),
                        oErrorPopover = this.byId("ErrorPopover");

                    // create popover
                    if (!oErrorPopover) {
                        Fragment.load({
                            id: oView.getId(),
                            name:
                                "sap.ui.Shop.view.fragments.ProductList.MessageErrorPopover",
                            controller: this,
                        }).then(function (oPopover) {
                            oView.addDependent(oPopover);
                            oPopover.openBy(oButton);
                        });
                    } else {
                        oErrorPopover.openBy(oButton);
                    }
                },

                /**
                 * "Add" button press event handler (in product table).
                 *  This method open product popover.
                 *  @public
                 *  @return {void}
                 */
                onAddProductPress: function () {
                    var oView = this.getView(),
                        oAllProductsDialog = this.byId("AllProductsDialog");

                    if (!oAllProductsDialog) {
                        // load asynchronous XML fragment
                        Fragment.load({
                            id: oView.getId(),
                            name:
                                "sap.ui.Shop.view.fragments.ProductList.ProductListAddProduct",
                            controller: this,
                        }).then(function (oAllProductsDialog) {
                            // connect dialog to the root view of this component (models, lifecycle)
                            oView.addDependent(oAllProductsDialog);
                            // show form
                            oAllProductsDialog.open();
                            this.onFilterProducts();
                        }.bind(this));
                    } else {
                        // show form
                        oAllProductsDialog.open();
                    }
                },

                /**
                 * "Cancel" button press event handler (in product popover).
                 *  This method close product popover.
                 *  @public
                 *  @return {void}
                 */
                onProductDialogCancelPress: function () {
                    var oAllProductsDialog = this.byId("AllProductsDialog"),
                        oTable = this.byId("AllProductsTable");

                    oAllProductsDialog.close();
                    oTable.removeSelections();
                    this.onFiltersClear();
                },

                /**
                 *  This method shows add button (in product popover).
                 *  @public
                 *  @return {void}
                 */
                onSelectProductsInDialogPress: function () {
                    var bIsDelete = !!this.byId(
                        "AllProductsTable"
                    ).getSelectedItems().length;
                    this.getModel("State").setProperty(
                        "/State/isButtonAddProductForm",
                        bIsDelete
                    );
                },

                /**
                 * Row selection event handler (Product List Table).
                 * After selection "delete button" will be enabled.
                 */
                onSelectProductsPress: function () {
                    var bIsDelete = !!this.byId(
                        "ProductListTable"
                    ).getSelectedItems().length;
                    this.getModel("State").setProperty(
                        "/State/isDeleteProductButton",
                        bIsDelete
                    );
                },

                /**
                 * "Delete" button press.
                 *  This method opens delete confirmation.
                 *  @public
                 *  @return {void}
                 */
                onDeleteProductPress: function () {
                    var oSelectItem = this.byId(
                            "ProductListTable"
                        ).getSelectedItems(),
                        sCategoryName,
                        sMessage;

                    if (oSelectItem.length === 1) {
                        sCategoryName = this.byId("ProductListTable")
                            .getSelectedItem()
                            .getBindingContext()
                            .getProperty("Name");

                        sMessage = this.getI18nWord(
                            "categoryMessageDelete",
                            sCategoryName
                        );
                    } else {
                        sMessage = this.getI18nWord("productsMessageDelete");
                    }

                    // show confirmation
                    MessageBox.confirm(sMessage, {
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                this._onDeleteProduct();
                            }
                        }.bind(this),
                    });
                },

                /**
                 * "Sort" button press.
                 *  This method open sort popover.
                 *  @public
                 *  @return {void}
                 */
                onOpenSortDialog: function () {
                    var oView = this.getView(),
                        oDialog = this.byId("SortDialog");

                    if (!oDialog) {
                        // load asynchronous XML fragment
                        Fragment.load({
                            id: oView.getId(),
                            name:
                                "sap.ui.Shop.view.fragments.ProductList.ProductListSort",
                            controller: this,
                        }).then(function (oDialog) {
                            // connect dialog to the root view of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            // show form
                            oDialog.open();
                        });
                    } else {
                        // show form
                        oDialog.open();
                    }
                },

                /**
                 * "Ok" button press.
                 *  This method sorts product list.
                 *  @public
                 *  @return {void}
                 */
                onSortProductList: function (oEvent) {
                    var oProductsTable = this.byId("ProductListTable"),
                        oItemsBinding = oProductsTable.getBinding("items"),
                        sParam = oEvent
                            .getParameters()
                            .sortItem.getProperty("key"),
                        bSortDesc = this.byId("SortDialog").getSortDescending(),
                        oSorter = new Sorter(sParam, bSortDesc);

                    // perform sorting
                    oItemsBinding.sort(oSorter);
                },

                /**
                 *  This method filters products (in product popover).
                 *  @public
                 *  @return {void}
                 */
                onFilterProducts: function () {
                    var oTable = this.byId("AllProductsTable"),
                        oItemsBinding = oTable.getBinding("items"),
                        sQueryName = this.getModel("State").getProperty(
                            "/State/sSearchName"
                        ),
                        sQueryPriceFrom = this.getModel("State").getProperty(
                            "/State/nSearchPriceFrom"
                        ),
                        sQueryPriceTo = this.getModel("State").getProperty(
                            "/State/nSearchPriceTo"
                        ),
                        sQueryRating = this.getModel("State").getProperty(
                            "/State/nSearchRating"
                        ),
                        sCategoryName = this.getView()
                            .getBindingContext()
                            .getProperty("Name"),
                        aFilter;

                    aFilter = new Filter({
                        filters: [
                            new Filter({
                                path: "Category/Name",
                                operator: FilterOperator.NE,
                                value1: sCategoryName,
                            }),
                        ],
                        and: true,
                    });

                    if (sQueryName) {
                        aFilter.aFilters.push(
                            new Filter({
                                path: "Name",
                                operator: FilterOperator.Contains,
                                value1: sQueryName,
                                caseSensitive: false,
                            })
                        );
                    }

                    if (sQueryPriceFrom) {
                        aFilter.aFilters.push(
                            new Filter(
                                "Price",
                                FilterOperator.GE,
                                sQueryPriceFrom
                            )
                        );
                    }

                    if (sQueryPriceTo) {
                        aFilter.aFilters.push(
                            new Filter(
                                "Price",
                                FilterOperator.LE,
                                sQueryPriceTo
                            )
                        );
                    }

                    if (sQueryRating !== "0") {
                        aFilter.aFilters.push(
                            new Filter({
                                path: "Rating",
                                operator: FilterOperator.BT,
                                value1: sQueryRating,
                                value2: +sQueryRating + 0.99,
                            })
                        );
                    }

                    // execute filtering
                    oItemsBinding.filter(aFilter);
                },

                /**
                 * "Clear" button press event handler of the "FilterBar".
                 *  @public
                 *  @return {void}
                 */
                onFiltersClear: function () {
                    var sQueryRating = this.byId("FilterRating");

                    this.getModel("State").setProperty(
                        "/State/sSearchName",
                        ""
                    ),
                        this.getModel("State").setProperty(
                            "/State/nSearchPriceFrom",
                            null
                        ),
                        this.getModel("State").setProperty(
                            "/State/nSearchPriceTo",
                            null
                        ),
                        sQueryRating.setSelectedItem(
                            sQueryRating.getItems()[0],
                            true,
                            true
                        );

                    this.onFilterProducts();
                },
            })
        );
    }
);
