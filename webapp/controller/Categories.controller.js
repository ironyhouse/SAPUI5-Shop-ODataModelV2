sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Fragment",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
    ],
    function (
        BaseController,
        JSONModel,
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
                var oCategory = new JSONModel({
                    Name: "",
                });
                this.getView().setModel(oCategory, "Category");
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
             */
            onCreateCategoryFormPress: function () {
                var oModel = this.getModel(),
                    sCategoryName = this.getModel("Category").getProperty(
                        "/Name"
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
                            MessageToast.show(
                                this.getI18nWord(
                                    "categoryCreateMessageSuccessful",
                                    sCategoryName
                                )
                            );
                        }.bind(this),
                        error: function () {
                            MessageBox.error(
                                this.getI18nWord(
                                    "categoryCreateMessageError",
                                    sCategoryName
                                )
                            );
                        }.bind(this),
                    }
                );

                this.byId("CategoryCreatorDialog").close();
                this.getModel("Category").setProperty("/Name", "");
                this.getMessageManager().removeAllMessages();
            },

            /**
             *  This method closes category popover.
             *  @public
             */
            onCancelCategoryFormPress: function () {
                this.byId("CategoryCreatorDialog").close();
                this.getModel("Category").setProperty("/Name", "");
                this.getMessageManager().removeAllMessages();
            },

            /**
             * This method checks category form validation.
             *  @public
             */
            checkFormValid: function () {
                var sCategoryName = !!this.getModel("Category").getProperty(
                    "/Name"
                );

                this.getModel("State").setProperty(
                    "/State/isShowCreateCategoryButton",
                    sCategoryName
                );
            },

            /**
             *  This method opens remove confirmation.
             *  @public
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
             */
            _onDeleteCategory: function () {
                var oModel = this.getModel(),
                    // get Category Id
                    oSelectItem = this.byId("CategoriesTable")
                        .getSelectedItem()
                        .getBindingContext(),
                    sCategoryName = oSelectItem.getProperty("Name");

                oModel.remove(oSelectItem.getPath(), {
                    success: function () {
                        MessageToast.show(
                            this.getI18nWord(
                                "categoryDeleteMessageSuccessful",
                                sCategoryName
                            )
                        );
                    }.bind(this),
                    error: function () {
                        MessageBox.error(
                            this.getI18nWord(
                                "categoryDeleteMessageError",
                                sCategoryName
                            )
                        );
                    }.bind(this),
                });

                this.byId("CategoriesTable").removeSelections();
                this.onSelectCategoryPress();
            },

            /**
             *  This method shows delete button
             *  @private
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
        });
    }
);
