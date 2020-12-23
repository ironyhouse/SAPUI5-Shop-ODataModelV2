sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/Fragment",
        "sap/m/Label",
        "sap/m/Token",
    ],
    function (BaseController, Filter, FilterOperator, Fragment, Label, Token) {
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
             * "Filter" event handler of the "FilterBar".
             */
            onSelectFilter: function () {
                var oCategoriesTable = this.byId("CategoriesTable"),
                    oItemsBinding = oCategoriesTable.getBinding("items"),
                    sQueryName = this.getView().byId("FilterName").getValue(),
                    aFilter = [];

                aFilter.push(
                    new Filter("Name", FilterOperator.Contains, sQueryName)
                );

                // execute filtering
                oItemsBinding.filter(aFilter);
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
                    oProductValueHelp = this.byId("ProductValueHelp");

                if (!oProductValueHelp) {
                    // load asynchronous XML fragment
                    var fragment = Fragment.load({
                        id: oView.getId(),
                        name:
                            "sap.ui.Shop.view.fragments.ProductList.ProductListValueHelp",
                        controller: this,
                    }).then(function (oProductValueHelp) {
                        // connect dialog to the root view of this component (models, lifecycle)
                        oView.addDependent(oProductValueHelp);
                        // show form
                        oProductValueHelp.open();
                    });
                } else {
                    // show form
                    oProductValueHelp.open();
                }

                // fragment.getTableAsync().then(function (oTable) {
                //     console.log(oTable);
                //     // oTable.setModel("oData>/Categories");
                // });

                // this.byId("ProductValueHelp").bindAggregation(
                //     "rows",
                //     "oData>/Categories"
                // );
                // this.byId("ProductValueHelp").bindAggregation(
                //     "items",
                //     "oData>/Categories"
                // );
            },

            onValueHelpOkPress: function (oEvent) {
                // var aTokens = oEvent.getParameter("tokens");
                // this._oMultiInput.setTokens(aTokens);
                this.byId("ProductValueHelp").close();
            },

            onValueHelpCancelPress: function () {
                this.byId("ProductValueHelp").close();
            },
        });
    }
);
