sap.ui.define(
    ["sap/ui/test/opaQunit", "./pages/Categories", "./pages/ProductList", "./pages/Supplier"],
    function (opaTest) {
        "use strict";

        QUnit.module("Posts")

        opaTest(
            "Should see the table with Categories.",
            function (Given, When, Then) {
                // Arrangements
                Given.iStartMyApp();
                // Assertions
                Then.onTheCategoriesPage.theTableShouldHavePagination();


                // Should see the Category Dialog.
                // Actions
                When.onTheCategoriesPage.iPressOnAddCategoryButton();
                // Assertions
                Then.onTheCategoriesPage.thePageShouldHaveCategoryDialog();
            }
        )

        opaTest(
            "Should see the new Category in table.",
            function (Given, When, Then) {
                // Should see the new Category in table.
                // Actions
                When.onTheCategoriesPage.iEnterCategoryName();
                When.onTheCategoriesPage.iPressOnCreateCategoryButton();
                // Assertions
                Then.onTheCategoriesPage.theTableShouldBeUpdate(4);


                // Should see that the category has been removed.
                // Actions
                When.onTheCategoriesPage.iSelectLastTableRow();
                When.onTheCategoriesPage.iPressOnCategoryDeleteConfirmationButton();
                When.onTheCategoriesPage.iPressOnDeleteCategoryButton();
                // Assertions
                Then.onTheCategoriesPage.theTableShouldBeUpdate(3);





                // Product List Page
                // Should see "Product List" Page.
                // Actions
                When.onTheCategoriesPage.iPressOnFirstTableRow();
                // Assertions
                Then.onTheProductListPage.theProductListPageShouldBeOpen();



                // The Sort popover should be open.
                // Actions
                When.onTheProductListPage.iPressOnSortProductsButton();
                // Assertions
                Then.onTheProductListPage.theTableShouldHaveSortDialog();
                // Actions
                When.onTheProductListPage.iPressOnCloseSortProductsButton();


                // Should see the AddProduct Dialog.
                // Actions
                When.onTheProductListPage.iPressOnEditProductButton();
                When.onTheProductListPage.iPressOnAddProductsButton();
                // Assertions
                Then.onTheProductListPage.thePageShouldHaveProductDialog();



                // The table should be growing.
                // Actions
                When.onTheProductListPage.iPressOnMoreData();
                // Assertions
                Then.onTheProductListPage.theTableShouldBeGrowing(8);
                // Actions
                When.onTheProductListPage.iPressOnCancelProductsButton();
                // When.onTheProductListPage.iPressOnCancelEditProductButton();
                // When.onTheProductListPage.iPressOnDiscardEditProductButton();



                // The table should have Pagination.
                // Assertions
                Then.onTheProductListPage.theTableShouldHavePagination();
                // Actions
                When.onTheProductListPage.iPressOnFirstProductListRow(0);





                // Product List Page
                // Should see "Supplier" Page.
                Then.onTheSupplierPage.theSupplierPageShouldBeOpen();
                Then.onTheSupplierPage.theTableShouldHavePagination();

                // Should nav back.
                // When.onTheSupplierPage.iPressOnNavBackProductList();
                // Then.onTheProductListPage.theProductListPageShouldBeOpen();
            }
        )
    }
);
