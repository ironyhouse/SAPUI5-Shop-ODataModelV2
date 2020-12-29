sap.ui.define(
    [
        "./BaseController",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Sorter",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
    ],
    function (
        BaseController,
        Fragment,
        Filter,
        FilterOperator,
        Sorter,
        MessageToast,
        MessageBox
    ) {
        "use strict";
        return BaseController.extend("sap.ui.Shop.controller.ProductList", {
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
                var sCategoriesURL = oEvent.getParameter("arguments")
                    .sCategoriesURL;

                this.getView().bindElement({
                    path: "/" + sCategoriesURL,
                    model: "oData",
                });
            },

            /**
             *  This method navigates to suppliers.
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

                oRouter.navTo("Suppliers", {
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
                var oODataModel = this.getModel("oData");

                this.getModel("State").setProperty(
                    "/State/isEditProduct",
                    false
                );

                // call the method to release the request queue
                oODataModel.submitChanges();
            },

            /**
             * Cancel button press event handler.
             */
            onCancelChangesPress: function () {
                var oODataModel = this.getModel("oData");

                this.getModel("State").setProperty(
                    "/State/isEditProduct",
                    false
                );

                // call the method to reset the request queue
                oODataModel.resetChanges();
            },

            onFilterProducts: function () {
                var oTable = this.byId("AllProductsTable"),
                    oItemsBinding = oTable.getBinding("items"),
                    sQueryName = this.getView()
                        .byId("FilterName")
                        .getValue()
                        .trim(),
                    sQueryPrice = this.getView().byId("FilterPrice").getValue(),
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

                if (sQueryPrice) {
                    aFilter.aFilters.push(
                        new Filter("Price", FilterOperator.EQ, sQueryPrice)
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
                    oProductListItems = this.byId("ProductListTable").getBinding("items"),
                    sProductsAddMessage = this.getI18nWord("productsAdd"),
                    // sProductsAddErrorMessage = this.getI18nWord(
                    //     "productsAddError"
                    // ),
                    sSelectedItems = oAllProductsTable.getSelectedItems(),
                    sCategoryName = this.getView()
                        .getBindingContext("oData")
                        .getPath();

                if (sSelectedItems !== 0) {
                    sSelectedItems.forEach(function (item) {
                        var sSelectedItem =
                            item.getBindingContextPath() + "/$links/Category";

                        oModel.update(
                            sSelectedItem,
                            { uri: sCategoryName }
                        );
                    });

                    oProductListItems.refresh();
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

            onSelectProductsPress: function () {
                var bIsDelete = !!this.byId("AllProductsTable").getSelectedItems().length;
                this.getModel("State").setProperty("/State/isButtonAddProductForm", bIsDelete);
            },

            /**
             * "Sort" button press.
             *  This method open sort popover.
             */
            onSortProductPress: function () {
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

            handleConfirm: function (oEvent) {
                var oProductsTable = this.byId("ProductListTable"),
                    oItemsBinding = oProductsTable.getBinding("items"),
                    sParam = oEvent.getParameters().sortItem.getProperty("key"),
                    bSortDesc = this.byId("SortDialog").getSortDescending(),
                    oSorter = new Sorter(sParam, bSortDesc);

                // perform sorting
                oItemsBinding.sort(oSorter);
            }
        });
    }
);
