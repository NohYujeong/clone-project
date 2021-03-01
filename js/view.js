(function () {
  class View {
    constructor(model) {
      this.model = model;
      this.templates = window.app.Templates;
    }

    // render 함수
    render(page) {
      if (page === "Board") {
        document.querySelector("#root").innerHTML = this.templates.Board(
          this.model.board.lists
        );
      }
    }

    // element 선택 함수
    getElement(selector) {
      return document.querySelector(selector);
    }

    // elements 선택 함수
    getElements(selector) {
      return document.querySelectorAll(selector);
    }

    // add event listener 함수
    addEvent(elementID, event, func) {
      document.getElementById(elementID).addEventListener(event, func);
    }

    // list & item input hide/show trigger 함수
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
