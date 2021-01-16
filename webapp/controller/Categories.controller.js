sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/Fragment",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
    ],
    function (
        BaseController,
        JSONModel,
        Filter,
        FilterOperator,
        Fragment,
        MessageToast,
        MessageBox
    ) {
        "use strict";
        return BaseController.extend("sap.ui.Shop.controller.Categories", {
            /**
             * Controller's "init" lifecycle method.
             */
            onInit: function () {
                var oView = this.getView(),
                    oMessageManager = this.getMessageManager();

                // Route
                this.getRouterForThis()
                    .getRoute("Categories")
                    .attachPatternMatched(this._onObjectMatched, this);

                var oCategory = new JSONModel({
                    Name: "",
                });
                this.getView().setModel(oCategory, "Category");

                // Register the view with the message manager
                oView.setModel(oMessageManager.getMessageModel(), "message");
                oMessageManager.registerObject(oView, true);
            },

            /**
             *  Bind context to the view.
             *  @private
             *  @return {void}
             */
            _onObjectMatched: function () {
                var oModel = this.getModel("State");

                oModel.setProperty("/State/isNavBackButton", false);
            },

            /**
             *  This method navigates to selected product category.
             * @public
             * @param {sap.ui.base.Event} oEvent event object.
             * @return {void}
             */
            onNavToCategory: function (oEvent) {
                var oSelectedListItem = oEvent.getSource(),
                    oRouter = this.getRouterForThis(),
                    sCategoriesURL = oSelectedListItem
                        .getBindingContext()
                        .getPath()
                        .substr(1);

                oRouter.navTo("ProductList", {
                    sCategoriesURL: sCategoriesURL,
                });
            },

            /**
             * "Add" button press event handler (in category table).
             *  This method opens product popover.
             *  @public
             *  @return {void}
             */
            onAddCategoryPress: function () {
                var oView = this.getView(),
                    oAllProductsDialog = this.byId("CategoryCreatorDialog");

                if (!oAllProductsDialog) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name:
                            "sap.ui.Shop.view.fragments.Categories.CategoriesCreateCategoryForm",
                        controller: this,
                    }).then(function (oPopover) {
                        // connect dialog to the root view of this component (models, lifecycle)
                        oView.addDependent(oPopover);
                        // show form
                        oPopover.open();
                    });
                } else {
                    // show form
                    oAllProductsDialog.open();
                }
            },

            /**
             *  This method adds new Category.
             *  @public
             *  @return {void}
             */
            onCreateCategoryFormPress: function () {
                var oModel = this.getModel(),
                    oCategoryName = this.byId("CategoryNameInput"),
                    sCategoryName = oCategoryName.getValue(),
                    sMessageSuccess = this.getI18nWord(
                        "categoryCreateMessageSuccessful",
                        sCategoryName
                    ),
                    sMessageError = this.getI18nWord(
                        "categoryCreateMessageError",
                        sCategoryName
                    ),
                    nCategoryID = Math.floor(Date.parse(new Date()) * 0.0001);

                oModel.create(
                    "/Categories",
                    {
                        Name: sCategoryName,
                        ID: nCategoryID,
                    },
                    {
                        success: function () {
                            MessageToast.show(sMessageSuccess);
                        },
                        error: function () {
                            MessageBox.error(sMessageError);
                        },
                    }
                );

                this.byId("CategoryCreatorDialog").close();
                oCategoryName.setValue();
                this.getMessageManager().removeAllMessages();
            },

            /**
             *  This method closes category popover.
             *  @public
             *  @return {void}
             */
            onCancelCategoryFormPress: function () {
                this.byId("CategoryCreatorDialog").close();
                this.byId("CategoryNameInput").setValue("");
                this.getMessageManager().removeAllMessages();
            },

            /**
             * This method checks category form validation.
             *  @public
             *  @return {void}
             */
            checkFormValid: function () {
                var oModel = this.getModel("State"),
                    sCategoryName = !!this.byId("CategoryNameInput").getValue(),
                    nValidationError = !!this.getMessageManager()
                        .getMessageModel()
                        .getData().length;

                if (sCategoryName && !nValidationError) {
                    oModel.setProperty(
                        "/State/isShowCreateCategoryButton",
                        true
                    );
                } else {
                    oModel.setProperty(
                        "/State/isShowCreateCategoryButton",
                        false
                    );
                }
            },

            /**
             *  This method opens remove confirmation.
             *  @public
             *  @return {void}
             */
            onDeleteCategoryButtonPress: function () {
                var oSelectItem = this.byId("CategoriesTable")
                        .getSelectedItem()
                        .getBindingContext(),
                    sCategoryName = oSelectItem.getProperty("Name"),
                    sMessage = this.getI18nWord(
                        "categoryMessageDelete",
                        sCategoryName
                    );

                // show confirmation
                MessageBox.confirm(sMessage, {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            this._onDeleteCategory();
                        }
                    }.bind(this),
                });
            },

            /**
             *  This method removes new Category.
             *  @private
             *  @return {void}
             */
            _onDeleteCategory: function () {
                var oModel = this.getModel(),
                    // get Category Id
                    oSelectItem = this.byId("CategoriesTable")
                        .getSelectedItem()
                        .getBindingContext(),
                    sCategoryName = oSelectItem.getProperty("Name"),
                    sMessageSuccess = this.getI18nWord(
                        "categoryDeleteMessageSuccessful",
                        sCategoryName
                    ),
                    sMessageError = this.getI18nWord(
                        "categoryDeleteMessageError",
                        sCategoryName
                    );

                oModel.remove(oSelectItem.getPath(), {
                    success: function () {
                        MessageToast.show(sMessageSuccess);
                    },
                    error: function () {
                        MessageBox.error(sMessageError);
                    },
                });

                this.byId("CategoriesTable").removeSelections();
                this.onSelectCategoryPress();
            },

            /**
             *  This method shows delete button
             *  @private
             *  @return {void}
             */
            onSelectCategoryPress: function () {
                var bIsDelete = !!this.byId(
                    "CategoriesTable"
                ).getSelectedItems().length;
                this.getModel("State").setProperty(
                    "/State/isShowDeleteCategoryButton",
                    bIsDelete
                );
            },

            /**
             *  This method Filter Categories.
             *  @public
             *  @return {void}
             */
            onFilterCategories: function () {
                var oCategoriesTable = this.byId("CategoriesTable"),
                    oItemsBinding = oCategoriesTable.getBinding("items"),
                    aQueryNames = this.byId("CategoriesMultiInput").getTokens(),
                    aFilter = [];

                aQueryNames.forEach(function (token) {
                    aFilter.push(
                        new Filter(
                            "Name",
                            FilterOperator.Contains,
                            token.getProperty("key")
                        )
                    );
                });

                // execute filtering
                oItemsBinding.filter(aFilter);
            },

            /**
             * "Clear" button press event handler of the "FilterBar".
             * This method clears multiInput.
             *  @public
             *  @return {void}
             */
            onFilterCategoriesClear: function () {
                this.byId("CategoriesMultiInput").setTokens([]);
                this.onFilterCategories();
            },
        });
    }
);
