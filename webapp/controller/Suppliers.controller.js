sap.ui.define(["./BaseController"], function (BaseController) {
    "use strict";
    return BaseController.extend("sap.ui.Shop.controller.Suppliers", {
        /**
         * Controller's "init" lifecycle method.
         */
        onInit: function () {
            // Route
            this.getRouterForThis()
                .getRoute("Suppliers")
                .attachPatternMatched(this._onSuppliersMatched, this);
        },

        /**
         *  Bind context to the view.
         *
         *  @param {sap.ui.base.Event} oEvent event object.
         */
        _onSuppliersMatched: function (oEvent) {
            var sProductURL = oEvent.getParameter("arguments").sProductURL;

            this.getView().bindElement({
                path: "/" + sProductURL + "/Supplier",
                model: "oData",
            });
        },
    });
});
