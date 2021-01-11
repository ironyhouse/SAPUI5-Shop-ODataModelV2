sap.ui.define(
    [
        "sap/ui/test/Opa5",
        "sap/ui/test/matchers/AggregationFilled",
        "sap/ui/test/matchers/AggregationLengthEquals",
        "sap/ui/test/actions/Press",
        "sap/ui/test/actions/EnterText",
    ],
    function (
        Opa5,
        AggregationFilled,
        AggregationLengthEquals,
        Press,
        EnterText
    ) {
        "use strict";

        var sViewName = "Categories",
            sTableId = "CategoriesTable",
            sAddCategoryButton = "AddCategoryButton",
            sDeleteCategoryButton = "DeleteCategoryButton",
            sCreateCategoryButton = "CreateCategoryButton",
            sCategoryNameInput = "CategoryNameInput";

        Opa5.createPageObjects({
            onTheCategoriesPage: {
                // Actions
                actions: {
                    iPressOnAddCategoryButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sAddCategoryButton,
                            actions: new Press(),
                            errorMessage:
                                "The Table does not have a Add Category Button",
                        });
                    },
                    iPressOnCategoryDeleteConfirmationButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sDeleteCategoryButton,
                            actions: new Press(),
                            errorMessage:
                                "The Table does not have a Delete Category Button",
                        });
                    },
                    iPressOnDeleteCategoryButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            searchOpenDialogs: true,
                            controlType: "sap.m.Button",
                            actions: new Press(),
                            success: function (aButtons) {
                                return aButtons.filter(function (oButton) {
                                    if (oButton.getText() == "OK") {
                                        oButton.firePress();
                                    }
                                });
                            },
                            errorMessage: "Category not deleted",
                        });
                    },
                    iPressOnCreateCategoryButton: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sCreateCategoryButton,
                            actions: new Press(),
                            errorMessage:
                                "The Table does not have a Add Category Button",
                        });
                    },
                    iEnterCategoryName: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sCategoryNameInput,
                            actions: new EnterText({ text: "New Category" }),
                            errorMessage: "The fragment does not have a input",
                        });
                    },
                    iPressOnFirstTableRow: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sTableId,
                            actions: function (oTable) {
                                var oFirstTableRow = oTable.getItems()[0];

                                oFirstTableRow.firePress();
                            },
                            errorMessage: "The Table row does not clicked.",
                        });
                    },
                    iSelectLastTableRow: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sTableId,
                            actions: function (oTable) {
                                var nSelectedItem =
                                    oTable.getItems().length - 1;

                                oTable.setSelectedItem(
                                    oTable.getItems()[nSelectedItem],
                                    true,
                                    true
                                );
                            },
                            errorMessage: "The Table row does not selected.",
                        });
                    },
                },
                // Assertions
                assertions: {
                    theTableShouldHavePagination: function () {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sTableId,
                            matchers: new AggregationFilled({
                                name: "items",
                            }),
                            success: function () {
                                Opa5.assert.ok(true, "The table has items.");
                            },
                            errorMessage: "The table does not items.",
                        });
                    },
                    theTableShouldBeUpdate: function (nLength) {
                        return this.waitFor({
                            viewName: sViewName,
                            id: sTableId,
                            matchers: new AggregationLengthEquals({
                                name: "items",
                                length: nLength,
                            }),
                            success: function () {
                                Opa5.assert.ok(
                                    true,
                                    "Category successfully deleted. The table changed successfully."
                                );
                            },
                            errorMessage: "The table does not change.",
                        });
                    },
                    thePageShouldHaveCategoryDialog: function () {
                        return this.waitFor({
                            searchOpenDialogs: true,
                            success: function (aDialog) {
                                Opa5.assert.ok(
                                    aDialog[0].isOpen(),
                                    "The Category dialog should be open."
                                );
                            },
                            errorMessage: "The Category dialog does not open.",
                        });
                    },
                },
            },
        });
    }
);
