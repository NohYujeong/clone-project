(function () {
  class Model {
    constructor() {
      this.Api = window.app.Api;
      this.board = { lists: [] };
    }

    // 난수 ID 생성
    createRandomID() {
      return Array(5)
        .fill()
        .map(() => Math.floor(Math.random() * (10 - 0)) + 0)
        .join("");
    }

    async getBoard() {
      this.board = await this.Api.get();
      return this.board;
    }

    addList(list) {
      this.board.lists.push(list);
      this.Api.post(this.board);
    }

    getList(listID) {
      return this.getListBoard().find((list) => list.id == listID);
    }

    updateListTitle(listID, title) {
      this.getList(listID).title = title;
      this.Api.post(this.board);
    }

    getListBoard() {
      return this.board.lists;
    }

    getItemList(itemID) {
      let itemList;
      this.board.lists.forEach((list) => {
        list.items.forEach((item) => {
          if (item.id == itemID) {
            itemList = list;
          }
        });
      });
      return itemList;
    }

    updateItemTitle(itemID, title) {
      this.getItem(itemID).title = title;
      this.Api.post(this.board);
    }

    addItem(listID, item) {
      this.getList(listID).items.push(item);
      this.Api.post(this.board);
    }

    getItem(itemID) {
      return this.getItemList(itemID).items.find((item) => item.id == itemID);
    }

    insertItem(listID, item, position) {
      this.getList(listID).items = this.getList(listID)
        .items.slice(0, position)
        .concat(item)
        .concat(this.getList(listID).items.slice(position));
      this.Api.post(this.board);
    }

    removeItem(itemID) {
      this.getItemList(itemID).items.splice(this.getItemIndex(itemID), 1);
      this.Api.post(this.board);
    }

    getItemIndex(itemID) {
      return this.getItemList(itemID).items.findIndex(
        (item) => item.id == itemID
      );
    }
  }

  window.app = window.app || {};
  window.app.Model = Model;
})();
