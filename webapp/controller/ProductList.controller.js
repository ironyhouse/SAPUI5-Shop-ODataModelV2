sap.ui.define(
    [
        "./BaseController",
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
        Fragment,
        Filter,
        FilterOperator,
        Sorter,
        MessageToast,
        MessageBox,
        formatter
    ) {
        "use strict";
        return BaseController.extend("sap.ui.Shop.controller.ProductList", {
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
                oView.setModel(oMessageManager.getMessageModel(), "message");
                oMessageManager.registerObject(oView, true);
            },

            /**
             *  Bind context to the view.
             *
             * @param {sap.ui.base.Event} oEvent event object.
             */
            _onObjectMatched: function (oEvent) {
                var oModel = this.getModel("State"),
                    sCategoriesURL = oEvent.getParameter("arguments")
                        .sCategoriesURL;

                this.getView().bindElement({
                    path: "/" + sCategoriesURL,
                    model: "oData",
                });

                oModel.setProperty("/State/isNavBackButton", true);
            },

            /**
             *  This method navigates to supplier.
             *
             *  @param {sap.ui.base.Event} oEvent event object.
             */
            onNavToSuppliers: function (oEvent) {
                var oSelectedListItem = oEvent.getSource(),
                    oRouter = this.getRouterForThis(),
                    sProductURL = oSelectedListItem
                        .getBindingContext("oData")
                        .getPath()
                        .substr(1);

                oRouter.navTo("Supplier", {
                    sProductURL: sProductURL,
                });
            },

            /**
             * "Edit Product" button press event handler.
             *  This method changes page to edit mode.
             */
            onEditProduct: function () {
                this.getModel("State").setProperty(
                    "/State/isEditProduct",
                    true
                );
            },

            /**
             * Save button press event handler.
             */
            onSaveChangesPress: function () {
                var oModel = this.getModel("oData"),
                    oProductListItems = this.byId(
                        "ProductListTable"
                    ).getBinding("items"),
                    nValidationError = this.getMessageManager()
                        .getMessageModel()
                        .getData().length;

                if (nValidationError === 0) {
                    this.getModel("State").setProperty(
                        "/State/isEditProduct",
                        false
                    );

                    oProductListItems.refresh(true)
                    // oModel.submitChanges({
                    //     success: oProductListItems.refresh(true),
                    // });
                }
            },

            /**
             *  This method opens popover.
             *
             *  @param {sap.ui.base.Event} oEvent event object.
             */
            onCancelConfirmOpen: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();

                // create popover
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name:
                            "sap.ui.Shop.view.fragments.ProductList.ProductListCancelEditPopover",
                        controller: this,
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
            },

            /**
             * Cancel button press event handler.
             */
            onDiscardChangesPress: function () {
                var oModel = this.getModel("oData"),
                    oProductListItems = this.byId(
                        "ProductListTable"
                    ).getBinding("items");

                this.getModel("State").setProperty(
                    "/State/isEditProduct",
                    false
                );

                oModel.submitChanges({
                    groupId: "CancelChangeCategory",
                    success: oProductListItems.refresh(true),
                });
                // call the method to reset the request queue
                oModel.resetChanges();
            },

            /**
             * This method open error popover.
             *
             *  @param {sap.ui.base.Event} oEvent event object.
             */
            onMessagePopoverPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();

                // create popover
                if (!this._pPopoverError) {
                    this._pPopoverError = Fragment.load({
                        id: oView.getId(),
                        name:
                            "sap.ui.Shop.view.fragments.ProductList.MessageErrorPopover",
                        controller: this,
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }
                this._pPopoverError.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
            },

            /**
             * "Add" button press event handler (in product table).
             *  This method open popover.
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
                    });
                } else {
                    // show form
                    oAllProductsDialog.open();
                }
            },

            /**
             * "Add" button press event handler (in product popover).
             *  This method add new products.
             */
            onProductDialogAddPress: function () {
                var oModel = this.getModel("oData"),
                    oAllProductsDialog = this.byId("AllProductsDialog"),
                    oAllProductsTable = this.byId("AllProductsTable"),
                    aSelectedItems = oAllProductsTable.getSelectedItems(),
                    oProductListItems = this.byId(
                        "ProductListTable"
                    ).getBinding("items"),
                    sProductsAddMessage = this.getI18nWord("productsAdd"),
                    // sProductsAddErrorMessage = this.getI18nWord(
                    //     "productsAddError"
                    // ),
                    sCategoryName = this.getView()
                        .getBindingContext("oData")
                        .getPath();

                oModel.setDeferredGroups(["CancelChangeCategory"]);

                if (aSelectedItems !== 0) {
                    aSelectedItems.forEach(function (item) {
                        var sSelectedItem =
                            item.getBindingContextPath() + "/$links/Category";

                        oModel.update(
                            sSelectedItem,
                            { uri: sCategoryName }
                        );

                        oModel.remove(
                            item.getBindingContextPath() + "/$links/Category",
                            { groupId: "CancelChangeCategory" }
                        );
                    });

                    oProductListItems.refresh(true),
                    oAllProductsDialog.destroy();
                    MessageToast.show(sProductsAddMessage);
                }
            },

            /**
             * "Cancel" button press event handler (in product popover).
             *  This method close popover.
             */
            onProductDialogCancelPress: function () {
                var oAllProductsDialog = this.byId("AllProductsDialog");
                oAllProductsDialog.close();
            },

            /**
             *  This method shows add button (in product popover).
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
             * Row selection event handler (Product List).
             * After selection "delete button" will be enabled.
             */
            onSelectProductsPress: function () {
                var bIsDelete = !!this.byId(
                    "ProductListTable"
                ).getSelectedItems().length;
                this.getModel("State").setProperty(
                    "/State/isEnabledDeleteProductButton",
                    bIsDelete
                );
            },

            /**
             * "Delete" button press.
             *  This method opens confirmation.
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
                        .getBindingContext("oData")
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
                            this.onDeleteProduct();
                        }
                    }.bind(this),
                });
            },

            /**
             * This method removes products in category.
             */
            onDeleteProduct: function () {
                var oModel = this.getModel("oData"),
                    // get Category Id
                    oProductsTable = this.byId("ProductListTable"),
                    aSelectedItems = oProductsTable.getSelectedItems(),
                    oProductListItems = this.byId(
                        "ProductListTable"
                    ).getBinding("items"),
                    sCategoryName = this.getView()
                        .getBindingContext("oData")
                        .getPath(),
                    sProductsDeleteMessage = this.getI18nWord(
                        "productsDeleteMessage"
                    );
                // sProductsDeleteError = this.getI18nWord("productsDeleteError");

                if (aSelectedItems !== 0) {
                    aSelectedItems.forEach(function (item) {
                        oModel.remove(
                            item.getBindingContextPath() + "/$links/Category"
                        );

                        oModel.update(
                            item.getBindingContextPath() + "/$links/Category",
                            { uri: sCategoryName },
                            { groupId: "CancelChangeCategory" }
                        );
                    });

                    oProductListItems.refresh(true),
                    MessageToast.show(sProductsDeleteMessage);
                }
            },

            /**
             * "Sort" button press.
             *  This method open sort popover.
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
             *  This method filters products (in product popover).
             */
            onFilterProducts: function () {
                var oTable = this.byId("AllProductsTable"),
                    oItemsBinding = oTable.getBinding("items"),
                    sQueryName = this.getView()
                        .byId("FilterName")
                        .getValue()
                        .trim(),
                    sQueryPriceFrom = this.getView()
                        .byId("PriceFrom")
                        .getValue(),
                    sQueryPriceTo = this.getView().byId("PriceTo").getValue(),
                    sQueryRating = this.byId("FilterRating").getSelectedKey(),
                    aFilter;

                aFilter = new Filter({
                    filters: [
                        new Filter({
                            path: "Name",
                            operator: FilterOperator.Contains,
                            value1: sQueryName,
                            caseSensitive: false,
                        }),
                    ],
                    and: true,
                });

                if (sQueryPriceFrom && !sQueryPriceTo) {
                    aFilter.aFilters.push(
                        new Filter("Price", FilterOperator.GE, sQueryPriceFrom)
                    );
                }

                if (!sQueryPriceFrom && sQueryPriceTo) {
                    aFilter.aFilters.push(
                        new Filter("Price", FilterOperator.LE, sQueryPriceTo)
                    );
                }

                if (sQueryPriceFrom && sQueryPriceTo) {
                    aFilter.aFilters.push(
                        new Filter({
                            path: "Price",
                            operator: FilterOperator.BT,
                            value1: sQueryPriceFrom,
                            value2: sQueryPriceTo,
                        })
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
             */
            onFiltersClear: function () {
                var sQueryName = this.getView().byId("FilterName"),
                    sQueryPrice = this.getView().byId("FilterPrice"),
                    sQueryRating = this.byId("FilterRating");

                sQueryName.setValue("");
                sQueryPrice.setValue(null);
                sQueryRating.setSelectedItem(
                    sQueryRating.getItems()[0],
                    true,
                    true
                );

                this.onFilterProducts();
            },

            /**
             * "Ok" button press.
             *  This method sorts product list.
             */
            onSortProductList: function (oEvent) {
                var oProductsTable = this.byId("ProductListTable"),
                    oItemsBinding = oProductsTable.getBinding("items"),
                    sParam = oEvent.getParameters().sortItem.getProperty("key"),
                    bSortDesc = this.byId("SortDialog").getSortDescending(),
                    oSorter = new Sorter(sParam, bSortDesc);

                // perform sorting
                oItemsBinding.sort(oSorter);
            },
        });
    }
);
