sap.ui.define(
    [
        "sap/ui/test/Opa5",
        "sap/ui/test/matchers/AggregationFilled",
        "sap/ui/test/matchers/AggregationLengthEquals",
        "sap/ui/test/actions/Press",
        "sap/ui/test/matchers/BindingPath",
    ],
    function (
        Opa5,
        AggregationFilled,
        AggregationLengthEquals,
        Press,
        BindingPath
    ) {
        "use strict";

        var sViewName = "ProductList",
            sAllProductsTableId = "AllProductsTable",
            sProductListTable = "ProductListTable",
            sEditProductButton = "EditProductButton",
            sAddProductsButton = "AddProductsButton",
            sAddProductCancelButton = "AddProductCancelButton",
            sSortProductList = "SortProductList",
            sCancelEditProductButton = "CancelEditProductButton",
            sDiscardEditProductButton = "DiscardEditProductButton";

        Opa5.createPageObjects({
            onTheProductListPage: {
                // Actions
                actions: {
                    iPressOnEditProductButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sEditProductButton,
                            actions: new Press(),
                            errorMessage:
                                "The Product List Page does not have a Edit button.",
                        });
                    },
                    iPressOnCancelEditProductButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sCancelEditProductButton,
                            actions: new Press(),
                            errorMessage:
                                "The Footer should to open Discard Popover.",
                        });
                    },
                    iPressOnDiscardEditProductButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sDiscardEditProductButton,
                            actions: new Press(),
                            errorMessage:
                                "The Product List Page should to exit edit mode.",
                        });
                    },
                    iPressOnAddProductsButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sAddProductsButton,
                            actions: new Press(),
                            errorMessage:
                                "The Product List Page does not have a Add Products button.",
                        });
                    },
                    iPressOnMoreData: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sAllProductsTableId,
                            actions: new Press(),
                            errorMessage: "The table does not have a trigger.",
                        });
                    },
                    iPressOnCancelProductsButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sAddProductCancelButton,
                            actions: new Press(),
                            errorMessage: "The AddProduct dialog is not close.",
                        });
                    },
                    iPressOnSortProductsButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sSortProductList,
                            actions: new Press(),
                            errorMessage: "The Sort popover is not open.",
                        });
                    },
                    iPressOnCloseSortProductsButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            searchOpenDialogs: true,
                            controlType: "sap.m.Button",
                            actions: new Press(),
                            success: function (aButtons) {
                                return aButtons.filter(function (oButton) {
                                    if (oButton.getText() == "Cancel") {
                                        oButton.firePress();
                                    }
                                });
                            },
                            errorMessage: "The Sort popover is not close.",
                        });
                    },
                    iPressOnFirstProductListRow: function (sId) {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sProductListTable,
                            actions: function (oTable) {
                                var oFirstTableRow = oTable.getItems()[0];

                                oFirstTableRow.firePress();
                            },
                            errorMessage: "The Table row does not clicked.",
                        });
                        // return this.waitFor({
                        //     controlType: "sap.m.ColumnListItem",
                        //     viewName: sViewName,
                        //     id: sProductListTable,
                        //     matchers: new BindingPath({
                        //         path: "/Products('" + sId + "')/Supplier",
                        //     }),
                        //     actions: new Press(),
                        //     errorMessage:
                        //         "No list item with the ID " +
                        //         sId +
                        //         " was found.",
                        // });
                    },
                },
                // Assertions
                assertions: {
                    theProductListPageShouldBeOpen: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            success: function () {
                                if (
                                    sap.ui.test.Opa5.getWindow().location
                                        .hash === "#/Categories(0)/Products"
                                ) {
                                    Opa5.assert.ok(
                                        true,
                                        "The ProductList page is open."
                                    );
                                }
                            },
                            errorMessage: "The ProductList page did not open.",
                        });
                    },
                    thePageShouldHaveProductDialog: function () {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            success: function (aDialog) {
                                Opa5.assert.ok(
                                    aDialog[0].isOpen(),
                                    "The AddProducts dialog is open."
                                );
                            },
                            errorMessage:
                                "The AddProducts dialog does not open.",
                        });
                    },
                    theTableShouldHaveSortDialog: function () {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            success: function (aDialog) {
                                Opa5.assert.ok(
                                    aDialog[0].isOpen(),
                                    "The Sort popover is open."
                                );
                            },
                            errorMessage: "The Sort popover does not open.",
                        });
                    },
                    theTableShouldHavePagination: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sProductListTable,
                            matchers: new AggregationFilled({
                                name: "items",
                            }),
                            success: function () {
                                Opa5.assert.ok(true, "The table has items.");
                            },
                            errorMessage: "The table does not items.",
                        });
                    },
                    theTableShouldBeGrowing: function (nLength) {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sAllProductsTableId,
                            matchers: new AggregationLengthEquals({
                                name: "items",
                                length: nLength,
                            }),
                            success: function () {
                                Opa5.assert.ok(true, "The table is growing.");
                            },
                            errorMessage: "The table does not grow.",
                        });
                    },
                },
            },
        });
    }
);
