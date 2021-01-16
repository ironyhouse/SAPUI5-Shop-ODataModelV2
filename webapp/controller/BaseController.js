sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"],
    function (Controller, UIComponent) {
        "use strict";
        return Controller.extend("sap.ui.Shop.controller.BaseController", {
            /**
             *  Method to get model.
             *  @public
             *  @return {string} sName - model name.
             *  @return {Object} Instance of oData model.
             */
            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            /**
             *  Method for creating a message from the i18n model.
             *  @public
             *  @param  {string} sName - Property
             *  @param  {string[]} aMessageWord - Array of values.
             *  @return {string} Text from i18n
             */
            getI18nWord: function (sName, aMessageWord = []) {
                var oBundle = this.getModel("i18n").getResourceBundle(),
                    sMessage = oBundle.getText(sName, aMessageWord);

                return sMessage;
            },

            /**
             *  Method for getting the route.
             *  @public
             *  @return {Object} - The object of the route instance
             */
            getRouterForThis: function () {
                return UIComponent.getRouterFor(this);
            },

            /**
             * Method for getting the message manager.
             * @function
             * @return {Object} - Returns message manager.
             */
            getMessageManager: function () {
                return sap.ui.getCore().getMessageManager();
            },
        });
    }
);
