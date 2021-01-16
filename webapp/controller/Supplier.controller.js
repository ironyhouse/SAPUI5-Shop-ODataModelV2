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
         *  @return {void}
         */
        _onSuppliersMatched: function (oEvent) {
            var oModel = this.getModel("State"),
                sProductURL = oEvent.getParameter("arguments").sProductURL;

            this.getView().bindElement({
                path: "/" + sProductURL + "/Supplier"
            });
            oModel.setProperty("/State/isNavBackButton", true);
        },
    });
});
