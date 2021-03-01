(function () {
  class Model {
    constructor() {
      this.board = { lists: [] };
    }

    // 난수 ID 생성
    createRandomID() {
      return Array(5)
        .fill()
        .map(() => Math.floor(Math.random() * (10 - 0)) + 0)
        .join("");
    }

    getBoard() {
      return this.board;
    }

    addList(list) {
      this.getBoard().lists.push(list);
    }

    getList(listID) {
      return this.getListBoard().find((list) => list.id == listID);
    }

    updateListTitle(listID, title) {
      this.getList(listID).title = title;
    }

    getListBoard() {
      return this.board.lists;
    }

    addItem(listID, item) {
      this.getList(listID).items.push(item);
    }

    getItem(itemID) {
      return this.getItemList(itemID).items.find((item) => item.id == itemID);
    }

    updateItemTitle(itemID, title) {
      this.getItem(itemID).title = title;
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

    insertItem(listID, item, position) {
      this.getList(listID).items = this.getList(listID)
        .items.slice(0, position)
        .concat(item)
        .concat(this.getList(listID).items.slice(position));
    }

    removeItem(itemID) {
      this.getItemList(itemID).items.splice(this.getItemIndex(itemID), 1);
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
