sap.ui.define(["./BaseController"], function (BaseController) {
    "use strict";
    return BaseController.extend("sap.ui.Shop.controller.ProductList", {
        /**
         * Controller's "init" lifecycle method.
         */
        onInit: function () {
            // Route
            this.getRouterForThis()
                .getRoute("ProductList")
                .attachPatternMatched(this._onObjectMatched, this);
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
            this.getModel("State").setProperty("/State/isEditProduct", true);
        },

        /**
         * Save button press event handler.
         */
        onSaveChangesPress: function () {
            var oODataModel = this.getModel("oData");

            this.getModel("State").setProperty("/State/isEditProduct", false);

            // call the method to release the request queue
            oODataModel.submitChanges();
        },

        /**
         * Cancel button press event handler.
         */
        onCancelChangesPress: function () {
            var oODataModel = this.getModel("oData");

            this.getModel("State").setProperty("/State/isEditProduct", false);

            // call the method to reset the request queue
            oODataModel.resetChanges();
        },
    });
});
