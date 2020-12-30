/* QUnit */
sap.ui.define(["sap/ui/Shop/model/formatter"], function (formatter) {
    "use strict";

    QUnit.module("Price State");

    function priceStateTestCase(oOptions) {
        // Act
        var sState = formatter.priceState(oOptions.price);

        // Assert
        oOptions.assert.strictEqual(
            sState,
            oOptions.expected,
            "The price state was correct"
        );
    }

    QUnit.test(
        "Should format the products with a price lower than 100 to Success",
        function (assert) {
            priceStateTestCase.call(this, {
                assert: assert,
                price: 42,
                expected: "Success",
            });
        }
    );

    QUnit.test(
        "Should format the products with a price upper than 100 to Warning",
        function (assert) {
            priceStateTestCase.call(this, {
                assert: assert,
                price: 100,
                expected: "Success",
            });
        }
    );

    QUnit.test(
        "Should format the products with a price upper than 100 to Warning",
        function (assert) {
            priceStateTestCase.call(this, {
                assert: assert,
                price: 112,
                expected: "Warning",
            });
        }
    );

});
