sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/Fragment",
        "sap/m/Label",
        "sap/m/Token",
        "sap/m/ColumnListItem",
    ],
    function (
        BaseController,
        Filter,
        FilterOperator,
        Fragment,
        Label,
        Token,
        ColumnListItem
    ) {
        "use strict";
        return BaseController.extend("sap.ui.Shop.controller.Categories", {
            /**
             * Controller's "init" lifecycle method.
             */
            onInit: function () {},

            /**
             *  This method navigates to selected product category.
             *
             * @param {sap.ui.base.Event} oEvent event object.
             */
            onNavToCategory: function (oEvent) {
                var oSelectedListItem = oEvent.getSource(),
                    oRouter = this.getRouterForThis(),
                    sCategoriesURL = oSelectedListItem
                        .getBindingContext("oData")
                        .getPath()
                        .substr(1);

                oRouter.navTo("ProductList", {
                    sCategoriesURL: sCategoriesURL,
                });
            },

            /**
             * "Clear" button press event handler of the "FilterBar".
             */
            onFiltersClear: function () {
                var oCategoriesTable = this.byId("CategoriesTable"),
                    oItemsBinding = oCategoriesTable.getBinding("items"),
                    sQueryName = this.getView().byId("FilterName");

                // clear search input
                sQueryName.setValue();

                // update product list
                oItemsBinding.filter();
            },

            onValueHelpOpenPress: function () {
                var oView = this.getView(),
                    oProductValueHelp = this.byId("ProductValueHelp"),
                    oValueHelpLayout = this.getModel("ValueHelpLayout"),
                    aTableColumns = oValueHelpLayout.getData().cols;

                if (!oProductValueHelp) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name:
                            "sap.ui.Shop.view.fragments.Categories.ProductListValueHelp",
                        controller: this,
                    })
                        .then(
                            function (oProductValueHelp) {
                                // connect dialog to the root view of this component (models, lifecycle)
                                oView.addDependent(oProductValueHelp);
                                this.oProductValueHelp = oProductValueHelp;

                                return oProductValueHelp.getTableAsync();
                            }.bind(this)
                        )
                        .then(
                            function (oTable) {
                                // oTable.setModel(oModel, "oData");
                                oTable.setModel(oValueHelpLayout, "columns");

                                // for desktop layout
                                if (oTable.bindRows) {
                                    oTable.bindAggregation(
                                        "rows",
                                        "oData>/Categories"
                                    );
                                }

                                // for mobile layout
                                if (oTable.bindItems) {
                                    oTable.bindAggregation(
                                        "items",
                                        "oData>/Categories",
                                        function () {
                                            return new ColumnListItem({
                                                cells: aTableColumns.map(
                                                    function (column) {
                                                        return new Label({
                                                            text:
                                                                "{" +
                                                                column.template +
                                                                "}",
                                                        });
                                                    }
                                                ),
                                            });
                                        }
                                    );
                                }

                                // show form
                                this.oProductValueHelp.update();
                            }.bind(this)
                        )
                        .then(
                            function () {
                                // show form
                                this.oProductValueHelp.open();
                            }.bind(this)
                        );
                } else {
                    // show form
                    oProductValueHelp.open();
                }
            },

            onAddToken: function () {
                var oCategoriesTable = this.byId("CategoriesTable"),
                    oItemsBinding = oCategoriesTable.getBinding("items"),
                    aQueryNames = this.byId("CategoriesMultiInput").getTokens(),
                    aFilter = [];

                aQueryNames.forEach(function (token) {
                    console.log(token.getProperty("key"));
                    aFilter.push(
                        new Filter("Name", FilterOperator.Contains, token.getProperty("key"))
                    );
                })

                // execute filtering
                oItemsBinding.filter(aFilter);
            },

            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");

                // set token to multiInput
                this.byId("CategoriesMultiInput").setTokens(aTokens);
                this.byId("CategoriesMultiInput").fireTokenUpdate();
                // close Value Help
                this.byId("ProductValueHelp").close();
            },

            onValueHelpCancelPress: function () {
                this.byId("ProductValueHelp").close();
            },
        });
    }
);
