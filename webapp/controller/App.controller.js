sap.ui.define(
    ["./BaseController", "sap/ui/core/routing/History"],
    function (BaseController, History) {
        "use strict";
        return BaseController.extend("sap.ui.Shop.controller.Categories", {

            /**
             *  This method navigates to home page.
             */
            onNavHome: function () {
                this.getRouterForThis().navTo("Categories");
            },

            /**
             *  This method navigates to previous page.
             */
            onNavBack: function () {
                var oHistory = History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.onNavHome();
                }
            },
        });
    }
);
