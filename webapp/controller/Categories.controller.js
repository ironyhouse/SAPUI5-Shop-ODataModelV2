sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/Fragment",
        "sap/m/Label",
        "sap/m/ColumnListItem",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
    ],
    function (
        BaseController,
        JSONModel,
        Filter,
        FilterOperator,
        Fragment,
        Label,
        ColumnListItem,
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

                // Register the view with the message manager
                oView.setModel(oMessageManager.getMessageModel(), "message");
                oMessageManager.registerObject(oView, true);

                var oCategory = new JSONModel({
                    Name: "",
                });

                this.getView().setModel(oCategory, "Category");
            },

            /**
             *  This method navigates to selected product category.
             *
             * @param {sap.ui.base.Event} oEvent event object.
             */
            onNavToCategory: function (oEvent) {
                var oSelectedListItem = oEvent.getSource(),
                    oRouter = this.getRouterForThis(),
                    sCategoriesURL = oSelectedListItem
                        .getBindingContext("oData")
                        .getPath()
                        .substr(1);

                oRouter.navTo("ProductList", {
                    sCategoriesURL: sCategoriesURL,
                });
            },

            /**
             *  This method open Value Help dialog.
             */
            onValueHelpOpenPress: function () {
                var oView = this.getView(),
                    oProductValueHelp = this.byId("ProductValueHelp"),
                    oValueHelpLayout = this.getModel("ValueHelpLayout"),
                    aTableColumns = oValueHelpLayout.getData().cols;

                if (!oProductValueHelp) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name:
                            "sap.ui.Shop.view.fragments.Categories.CategoriesValueHelp",
                        controller: this,
                    })
                        .then(
                            function (oProductValueHelp) {
                                // connect dialog to the root view of this component (models, lifecycle)
                                oView.addDependent(oProductValueHelp);
                                this.oProductValueHelp = oProductValueHelp;

                                return oProductValueHelp.getTableAsync();
                            }.bind(this)
                        )
                        .then(
                            function (oTable) {
                                // oTable.setModel(oModel, "oData");
                                oTable.setModel(oValueHelpLayout, "columns");

                                // for desktop layout
                                if (oTable.bindRows) {
                                    oTable.bindAggregation(
                                        "rows",
                                        "oData>/Categories"
                                    );
                                }

                                // for mobile layout
                                if (oTable.bindItems) {
                                    oTable.bindAggregation(
                                        "items",
                                        "oData>/Categories",
                                        function () {
                                            return new ColumnListItem({
                                                cells: aTableColumns.map(
                                                    function (column) {
                                                        return new Label({
                                                            text:
                                                                "{" +
                                                                column.template +
                                                                "}",
                                                        });
                                                    }
                                                ),
                                            });
                                        }
                                    );
                                }

                                // show form
                                this.oProductValueHelp.update();
                            }.bind(this)
                        )
                        .then(
                            function () {
                                // show form
                                this.oProductValueHelp.open();
                            }.bind(this)
                        );
                } else {
                    // show form
                    oProductValueHelp.open();
                }
            },

            /**
             *  This method adds tokens to multiInput and closes Value Help dialog.
             */
            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");

                // set token to multiInput
                this.byId("CategoriesMultiInput").setTokens(aTokens);
                this.byId("CategoriesMultiInput").fireTokenUpdate();
                // close Value Help
                this.byId("ProductValueHelp").close();
            },

            /**
             *  This method closes Value Help dialog.
             */
            onValueHelpCancelPress: function () {
                this.byId("ProductValueHelp").close();
            },

            /**
             * "Add" button press event handler (in category table).
             *  This method open popover.
             */
            onAddCategoryPress: function () {
                var oView = this.getView(),
                    oAllProductsDialog = this.byId("categoryCreator");

                if (!oAllProductsDialog) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name:
                            "sap.ui.Shop.view.fragments.Categories.CategoriesCreateCategoryForm",
                        controller: this,
                    }).then(function (oAllProductsDialog) {
                        // connect dialog to the root view of this component (models, lifecycle)
                        oView.addDependent(oAllProductsDialog);
                        // show form
                        oAllProductsDialog.open();
                    });
                } else {
                    // show form
                    oAllProductsDialog.open();
                }
            },

            /**
             *  This method adds new Category.
             */
            onCreateCategoryFormPress: function () {
                var oModel = this.getModel("oData"),
                    oCategoryName = this.byId("CategoryName"),
                    sCategoryName = oCategoryName.getValue(),
                    nID = Math.floor(Math.random() * 100 + new Date().getDay()),
                    sMessageSuccess = this.getI18nWord(
                        "categoryCreateMessageSuccessful",
                        sCategoryName
                    ),
                    sMessageError = this.getI18nWord(
                        "categoryCreateMessageError",
                        sCategoryName
                    );

                oModel.create(
                    "/Categories",
                    {
                        Name: sCategoryName,
                        ID: nID,
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

                this.byId("categoryCreator").close();
                oCategoryName.setValue();
                this.getMessageManager().removeAllMessages();
            },

            /**
             *  This method closes popover.
             */
            onCancelCategoryFormPress: function () {
                this.byId("categoryCreator").close();
                this.byId("CategoryName").setValue("");
                this.getMessageManager().removeAllMessages();
            },

            /**
             * This method checks category form.
             */
            checkFormValid: function () {
                var oModel = this.getModel("State"),
                    sCategoryName = !!this.byId("CategoryName").getValue(),
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
             */
            onDeleteCategoryButtonPress: function () {
                var oSelectItem = this.byId("CategoriesTable")
                        .getSelectedItem()
                        .getBindingContext("oData"),
                    sCategoryName = oSelectItem.getProperty("Name"),
                    sMessage = this.getI18nWord(
                        "categoryMessageDelete",
                        sCategoryName
                    );

                // show confirmation
                MessageBox.confirm(sMessage, {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            this.onDeleteCategory();
                        }
                    }.bind(this),
                });
            },

            /**
             *  This method removes new Category.
             */
            onDeleteCategory: function () {
                var oModel = this.getModel("oData"),
                    // get Category Id
                    oSelectItem = this.byId("CategoriesTable")
                        .getSelectedItem()
                        .getBindingContext("oData"),
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
            },

            /**
             *  This method shows delete button
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
             */
            onFilterCategoriesClear: function () {
                this.byId("CategoriesMultiInput").setTokens([]);
                this.onFilterCategories();
            },
        });
    }
);
