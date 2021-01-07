sap.ui.define(
    [
        "sap/ui/test/Opa5",
        "./arrangements/Startup",
        "sap/ui/test/opaQunit",
        "./pages/Categories",
        "./pages/ProductList",
        "./pages/Supplier",
    ],
    function (Opa5, Startup, opaTest) {
        "use strict";

        Opa5.extendConfig({
            arrangements: new Startup(),
            viewNamespace: "sap.ui.Shop.view.",
            autoWait: true,
        });

        QUnit.module("Categories Page");

        opaTest(
            "Should see the table with Categories.",
            function (Given, When, Then) {
                // Arrangements
                Given.iStartMyApp();
                // Assertions
                Then.onTheCategoriesPage.theTableShouldHavePagination();
            }
        );

        opaTest(
            "Should see the Category Dialog.",
            function (Given, When, Then) {
                // Actions
                When.onTheCategoriesPage.iPressOnAddCategoryButton();
                // Assertions
                Then.onTheCategoriesPage.thePageShouldHaveCategoryDialog();
            }
        );

        opaTest(
            "Should see the new Category in table.",
            function (Given, When, Then) {
                // Actions
                When.onTheCategoriesPage.iEnterCategoryName();
                When.onTheCategoriesPage.iPressOnCreateCategoryButton();
                // Assertions
                Then.onTheCategoriesPage.theTableShouldBeUpdate(4);
            }
        );

        opaTest(
            "Should see that the category has been removed.",
            function (Given, When, Then) {
                // Actions
                When.onTheCategoriesPage.iSelectLastTableRow();
                When.onTheCategoriesPage.iPressOnCategoryDeleteConfirmationButton();
                When.onTheCategoriesPage.iPressOnDeleteCategoryButton();
                // Assertions
                Then.onTheCategoriesPage.theTableShouldBeUpdate(3);
            }
        );

        QUnit.module("Product List Page");

        opaTest(
            "Should see 'Product List' Page.",
            function (Given, When, Then) {
                // Actions
                When.onTheCategoriesPage.iPressOnFirstTableRow();
                // Assertions
                Then.onTheProductListPage.theProductListPageShouldBeOpen();
            }
        );

        opaTest(
            "The Sort popover should be open.",
            function (Given, When, Then) {
                // Actions
                When.onTheProductListPage.iPressOnSortProductsButton();
                // Assertions
                Then.onTheProductListPage.theTableShouldHaveSortDialog();
                // Actions
                When.onTheProductListPage.iPressOnCloseSortProductsButton();
            }
        );

        opaTest(
            "Should see the AddProduct Dialog",
            function (Given, When, Then) {
                // Actions
                When.onTheProductListPage.iPressOnEditProductButton();
                When.onTheProductListPage.iPressOnAddProductsButton();
                // Assertions
                Then.onTheProductListPage.thePageShouldHaveProductDialog();
            }
        );

        opaTest(
            "The AllProducts table should be growing.",
            function (Given, When, Then) {
                // The table should be growing.
                // Actions
                When.onTheProductListPage.iPressOnMoreData();
                // Assertions
                Then.onTheProductListPage.theTableShouldBeGrowing(8);
                // Actions
                When.onTheProductListPage.iPressOnCancelProductsButton();
                // When.onTheProductListPage.iPressOnCancelEditProductButton();
                // When.onTheProductListPage.iPressOnDiscardEditProductButton();
            }
        );

        opaTest(
            "The Products table should have Pagination.",
            function (Given, When, Then) {
                // Assertions
                Then.onTheProductListPage.theTableShouldHavePagination();
            }
        );

        QUnit.module("Supplier Page");

        opaTest("Should see 'Supplier' Page.", function (Given, When, Then) {
            // Actions
            When.onTheProductListPage.iPressOnFirstProductListRow(0);
            Then.onTheSupplierPage.theSupplierPageShouldBeOpen();
        });

        opaTest(
            "he Products table(Supplier) should have Pagination.",
            function (Given, When, Then) {
                Then.onTheSupplierPage.theTableShouldHavePagination();

                // Should nav back.
                // When.onTheSupplierPage.iPressOnNavBackProductList();
                // Then.onTheProductListPage.theProductListPageShouldBeOpen();

                Then.iTeardownMyApp();
            }
        );
    }
);
