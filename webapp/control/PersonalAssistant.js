sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Label",
	"sap/m/Button",
	"sap/ui/core/Fragment"
], function (Control, Label, Button, Fragment) {
	"use strict";
	return Control.extend("sap.ui.Shop.control.PersonalAssistant", {
        metadata : {
			properties : {
				value: 	{type : "float", defaultValue : 0}
			},
			aggregations : {
				_label : {type : "sap.m.Label", multiple: false, visibility : "hidden"},
				_button : {type : "sap.m.Button", multiple: false, visibility : "hidden"},
				_buttonClose : {type : "sap.m.Button", multiple: false, visibility : "hidden"}
			},
		},
		init : function () {
			// text
			this.setAggregation("_label", new Label({
				text: "{i18n>botWelcome}"
			}).addStyleClass("sapUiSmallMargin"));
			// open button
			this.setAggregation("_button", new Button({
				press: this.onOpenQuestionDialog.bind(this),
                icon: "control/img/sapBoy.png"
			}));
			// close button
			this.setAggregation("_buttonClose", new Button({
				press: this._onCloseAssistant,
                icon: "sap-icon://decline"
			}).addStyleClass("closeButton"));
		},

		/**
		 *  This method creates question dialog.
		 *  @public
		 */
		onOpenQuestionDialog : function () {
            var oView = this.getParent().getController().getView(),
            oAllProductsDialog = this.getParent().getController().byId("CategoryCreatorDialog"),
			helloAudio = new Audio('control/audio/Hello.mp3');

            if (!oAllProductsDialog) {
                // load asynchronous XML fragment
                Fragment.load({
                    id: oView.getId(),
                    name:
                        "sap.ui.Shop.control.PersonalAssistant",
                    controller: this,
                }).then(function (oPopover) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oPopover);
                    // show form
                    oPopover.open();
                });
            }

			helloAudio.play();
		},

		/**
		 *  This method sends question.
		 *  @private
		 */
		_onSendQuestion : function () {
			console.log("User Question:");
			console.log(this.getModel("Question").getProperty("/Question/sQuestion"));
			this.getModel("Question").setProperty("/Question/sQuestion", "");

			var byeAudio = new Audio('control/audio/Bye.mp3');

			byeAudio.play();
		},

		/**
		 *  This method save question.
		 *  @public
		 */
		onSendQuestionPress: function () {
			this.getParent().getController().byId("questionForm").destroy(true);
			this._onSendQuestion();
		},

		/**
		 *  This method closes category popover.
		 *  @public
		 */
		onCancelQuestionFormPress: function () {
			this.getParent().getController().byId("questionForm").destroy(true);
			this.getModel("Question").setProperty("/Question/sQuestion", "");
		},

		/**
		 * Check question dialog for validation.
		 * @public
		 */
		checkQuestionFormValid: function () {
			var bIsValue = !!this.getParent().getController().byId(
				"questionText"
			).getValue().length;
			this.getParent().getController().getModel("Question").setProperty(
				"/Question/bSendButton",
				bIsValue
			);
		},

		/**
		 * This method Assistant.
		 * @private
		 */
		_onCloseAssistant: function () {
			this.getParent().addStyleClass("hide");
		},

		renderer : function (oRm, oControl) {
			oRm.openStart("div", oControl);
			oRm.class("botWrapper");
			oRm.openEnd();
                // Welcome
                oRm.openStart("div", oControl);
                oRm.class("botWrapper--title");
                oRm.openEnd();
			        oRm.renderControl(oControl.getAggregation("_label"));
                oRm.close("div");
                // Avatar
                oRm.openStart("div", oControl);
                oRm.class("botWrapper--avatar");
                oRm.openEnd();
                    oRm.renderControl(oControl.getAggregation("_button"));
                oRm.close("div");
				// Close
				oRm.renderControl(oControl.getAggregation("_buttonClose"));
			oRm.close("div");
		}
	});
});