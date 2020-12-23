sap.ui.define(
    ["./BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
    function (BaseController, Filter, FilterOperator) {
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
        });
    }
);
