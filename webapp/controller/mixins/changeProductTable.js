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
                        var sSelectedItem =
                            item.getBindingContextPath() + "/$links/Category";

                        oModel.update(sSelectedItem, { uri: sCategoryPath });

                        this._addBatchRequest(
                            item.getBindingContextPath() + "/$links/Category",
                            "remove"
                        );
                    }.bind(this)
                );

                oProductListItems.refresh(true);
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
                );

            if (aSelectedItems !== 0) {
                aSelectedItems.forEach(
                    function (item) {
                        oModel.remove(
                            item.getBindingContextPath() + "/$links/Category"
                        );

                        this._addBatchRequest(
                            item.getBindingContextPath() + "/$links/Category",
                            "update"
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
        _addBatchRequest: function (sProductName, sOperation) {
            var uniqueRequest;
            
            uniqueRequest = this.aBatchRequest.some(function(item) {
                return (item.path === sProductName);
            });

            if (!uniqueRequest) {
                this.aBatchRequest.push({
                    path: sProductName,
                    operation: sOperation,
                });
            }
        },

        /**
         * This method create unique requests.
         * @private
         */
        _createBatchRequest: function () {
            var oModel = this.getModel(),
                sCategoryName = this.getView().getBindingContext().getPath();

            this.aBatchRequest.forEach(function (item) {
                if (item.operation === "remove") {
                    oModel.remove(item.path, {
                        groupId: "CancelChangeCategory",
                    });
                } else {
                    oModel.update(
                        item.path,
                        { uri: sCategoryName },
                        { groupId: "CancelChangeCategory" }
                    );
                }
            });
        },
    };
});
