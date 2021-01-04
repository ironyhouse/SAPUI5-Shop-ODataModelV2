sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Defines a value state based on the price
		 *
		 * @public
		 * @param {number} iPrice the price of a post
		 * @returns {string} sValue the state for the price
		 */
		priceState: function (iPrice) {
			if (iPrice < 101) {
				return "Success";
			} else if (iPrice >= 100 ) {
				return "Warning";
			}
		}

	};

});
