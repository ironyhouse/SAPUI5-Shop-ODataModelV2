sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Defines a value state based on the price
		 *
		 * @public
		 * @param {number} nPrice - The price of a post
		 * @returns {string} sValue the state for the price
		 */
		priceState: function (nPrice) {
			if (nPrice < 101) {
				return "Success";
			} else if (nPrice >= 100 ) {
				return "Warning";
			}
		}

	};

});
