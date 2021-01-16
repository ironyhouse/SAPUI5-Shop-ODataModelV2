sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
    "use strict";
    return {
        /**
         * "Add" button press event handler (in product popover).
         *  This method add new products from category.
         *  @public
         *  @return {void}
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
                sCategoryName = this.getView().getBindingContext().getPath();

            if (aSelectedItems !== 0) {
                aSelectedItems.forEach(
                    function (item) {
                        var sSelectedItem =
                            item.getBindingContextPath() + "/$links/Category";

                        oModel.update(sSelectedItem, { uri: sCategoryName });

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
         * @return {void}
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
            var uniqueRequest = true;
            this.aBatchRequest.forEach(function (item) {
                if (item.path === sProductName) {
                    uniqueRequest = false;
                    return;
                }
            });
            if (uniqueRequest) {
                this.aBatchRequest.push({
                    path: sProductName,
                    operation: sOperation,
                });
            }
        },

        /**
         * This method create unique requests.
         * @private
         * @return {void}
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
