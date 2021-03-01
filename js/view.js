(function () {
  class View {
    constructor(model) {
      this.model = model;
      this.templates = window.app.Templates;
    }

    render(page) {
      if (page === "Board") {
        document.querySelector("#root").innerHTML = this.templates.Board(
          this.model.board.lists
        );
      }
    }

    getElement(selector) {
      return document.querySelector(selector);
    }

    getElements(selector) {
      return document.querySelectorAll(selector);
    }

    addEvent(elementID, event, func) {
      document.getElementById(elementID).addEventListener(event, func);
    }

    showTitleInput(textID, inputID) {
      document.getElementById(textID).className = document
        .getElementById(textID)
        .className.replace("show", "hide");

      document.getElementById(inputID).className = document
        .getElementById(inputID)
        .className.replace("hide", "show");

      document.getElementById(inputID).focus();
    }
  }

  window.app = window.app || {};
  window.app.View = View;
})();
