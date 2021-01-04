sap.ui.define(
    [
        "sap/ui/test/Opa5",
        "sap/ui/test/matchers/AggregationFilled",
        "sap/ui/test/actions/Press"
    ],
    function (
        Opa5,
        AggregationFilled,
        Press,
    ) {
        "use strict";

        var sViewName = "Supplier",
            sTableId = "SupplierProductList",
            sShellBar = "ShellBar";

        Opa5.createPageObjects({
            onTheSupplierPage: {
                // Actions
                actions: {
                    iPressOnNavBackProductList: function () {
                        return this.waitFor({
                            viewName: "App",
                            id: sShellBar,
                            controlType: "sap.m.Button",
                            actions: new Press(),
                            // actions: function (oShell) {
                            //     oShell.attachNavButtonPressed()
                            // },
                            errorMessage:
                                "The Supplier Page does not navigate to back.",
                        });
                    },
                },
                // Assertions
                assertions: {
                    theSupplierPageShouldBeOpen: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            success: function () {
                                if (
                                    sap.ui.test.Opa5.getWindow().location
                                        .hash === "#/Products(0)/Supplier"
                                ) {
                                    Opa5.assert.ok(
                                        true,
                                        "The Supplier page is open."
                                    );
                                }
                            },
                            errorMessage: "The Supplier page did not open.",
                        });
                    },
                    theTableShouldHavePagination: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sTableId,
                            matchers: new AggregationFilled({
                                name: "items",
                            }),
                            success: function () {
                                Opa5.assert.ok(
                                    true,
                                    "The table has items."
                                );
                            },
                            errorMessage: "The table does not items.",
                        });
                    },
                },
            },
        });
    }
);
