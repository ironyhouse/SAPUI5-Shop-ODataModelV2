sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
    "use strict";
    return {
        /**
         * "Add" button press event handler (in product popover).
         *  This method add new products from category.
         *  @public
         */
        onProductDialogAddPress: function () {
            var oModel = this.getModel(),
                oAllProductsDialog = this.byId("AllProductsDialog"),
                oAllProductsTable = this.byId("AllProductsTable"),
                aSelectedItems = oAllProductsTable.getSelectedItems(),
                oProductListItems = this.byId("ProductListTable").getBinding(
                    "items"
                ),
                sProductsAddMessage = this.getI18nWord("productsAdd"),
                sCategoryPath = this.getView().getBindingContext().getPath();

            if (aSelectedItems !== 0) {
                aSelectedItems.forEach(
                    function (item) {
                        oModel.read(
                            item.getBindingContextPath() + "/$links/Category",
                            {
                                success: function (sOldCategoryPath) {
                                    oModel.update(
                                        item.getBindingContextPath() +
                                            "/$links/Category",
                                        { uri: sCategoryPath },
                                        {
                                            success: function () {
                                                oProductListItems.refresh(true);
                                            }.bind(this),
                                        }
                                    );

                                    this._addBatchRequest(
                                        item.getBindingContextPath() +
                                            "/$links/Category",
                                        sOldCategoryPath.uri,
                                        "update"
                                    );
                                }.bind(this),
                                error: function () {
                                    oModel.update(
                                        item.getBindingContextPath() +
                                            "/$links/Category",
                                        { uri: sCategoryPath }
                                    );

                                    this._addBatchRequest(
                                        item.getBindingContextPath() +
                                            "/$links/Category",
                                        null,
                                        "remove"
                                    );

                                    oProductListItems.refresh(true);
                                }.bind(this),
                            }
                        );
                    }.bind(this)
                );

                oAllProductsDialog.destroy();
                MessageToast.show(sProductsAddMessage);
            }
        },

        /**
         * This method removes products in category.
         * @private
         */
        _onDeleteProduct: function () {
            var oModel = this.getModel(),
                // get Category Id
                oProductsTable = this.byId("ProductListTable"),
                aSelectedItems = oProductsTable.getSelectedItems(),
                oProductListItems = this.byId("ProductListTable").getBinding(
                    "items"
                ),
                sProductsDeleteMessage = this.getI18nWord(
                    "productsDeleteMessage"
                ),
                sCategoryPath = this.getView().getBindingContext().getPath();

            if (aSelectedItems !== 0) {
                aSelectedItems.forEach(
                    function (item) {
                        oModel.remove(
                            item.getBindingContextPath() + "/$links/Category"
                        );

                        this._addBatchRequest(
                            item.getBindingContextPath() + "/$links/Category",
                            sCategoryPath
                        );
                    }.bind(this)
                );

                oProductListItems.refresh(true);
                MessageToast.show(sProductsDeleteMessage);
                this.getModel("State").setProperty(
                    "/State/isDeleteProductButton",
                    false
                );
            }
        },

        /**
         * This method saves unique requests.
         * @private
         * @return {void}
         */
        _addBatchRequest: function (sProductPath, sCategoryPath, sOperation) {
            var uniqueRequest;

            uniqueRequest = this.aBatchRequest.some(function (item) {
                return item.path === sProductPath;
            });

            if (!uniqueRequest) {
                this.aBatchRequest.push({
                    path: sProductPath,
                    categoryPath: sCategoryPath,
                    operation: sOperation,
                });
            }
        },

        /**
         * This method create unique requests.
         * @private
         */
        _createBatchRequest: function () {
            this.aBatchRequest.forEach(
                function (item) {
                    if (item.operation === "remove") {
                        this.getModel().remove(item.path, {
                            groupId: "CancelChangeCategory",
                        });
                    } else {
                        this.getModel().update(
                            item.path,
                            { uri: item.categoryPath },
                            { groupId: "CancelChangeCategory" }
                        );
                    }
                }.bind(this)
            );
        },
    };
});
