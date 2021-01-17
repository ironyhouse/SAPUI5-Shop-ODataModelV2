sap.ui.define(["./BaseController"], function (BaseController) {
    "use strict";
    return BaseController.extend("sap.ui.Shop.controller.Supplier", {
        /**
         * Controller's "init" lifecycle method.
         */
        onInit: function () {
            // Route
            this.getRouterForThis()
                .getRoute("Supplier")
                .attachPatternMatched(this._onSuppliersMatched, this);
        },

        /**
         *  Bind context to the view.
         *  @param {sap.ui.base.Event} oEvent event object.
         *  @private
         */
        _onSuppliersMatched: function (oEvent) {
            var sProductURL = oEvent.getParameter("arguments").sProductURL;

            this.getView().bindElement({
                path: "/" + sProductURL + "/Supplier",
            });
        },

        /**
         *  This method navigates to categories.
         *  @public
         */
        navToCategories: function () {
            this.getRouterForThis().navTo("Categories");
        },

        /**
         *  This method navigates to Products List.
         *  @public
         */
        navToProducts: function () {
            var sCategoriesURL = this.getModel("State").getProperty(
                "/State/sCategoriesURL"
            );
            if (sCategoriesURL) {
                this.getRouterForThis().navTo("ProductList", {
                    sCategoriesURL: sCategoriesURL,
                });
            } else {
                this.navToCategories();
            }

        },
    });
});
