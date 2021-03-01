(function () {
  class Controller {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.refresh("Board");
    }

    // 페이지 리프레쉬
    async refresh(page) {
      await this.view.render(page);
      this.setEvents();
    }

    // 페이지 내에 필요한 이벤트 설정
    setEvents() {
      // Add a list 버튼 클릭 시 발생하는 이벤트
      this.view.addEvent("add-list", "click", () => this.createList());

      // Add a item 버튼 클릭 시 발생하는 이벤트
      this.view.getElements(".add-item").forEach((button) => {
        this.view.addEvent(button.id, "click", () =>
          this.createItem(button.id.split("-")[2])
        );
      });

      // list title 관련 이벤트
      this.view.getElements(".list-title").forEach((list) => {
        this.setTitleEditionEvents(list.id, list.id + "-input", "list");
      });

      // item 관련 이벤트
      this.view.getElements(".item").forEach((item) => {
        this.setTitleEditionEvents(item.id, item.id + "-input", "item");
        this.view.addEvent(item.id, "dragstart", (event) =>
          this.dragStarted(event, item.id)
        );
        this.view.addEvent(item.id, "dragend", (event) =>
          this.dragEnded(event)
        );
      });

      // dragenter 이벤트
      this.view.getElements(".droppable").forEach((element) => {
        this.view.addEvent(element.id, "dragenter", (event) =>
          this.dragEnter(event)
        );
      });
    }

    // list 생성
    createList() {
      this.model.addList({
        id: this.model.createRandomID(),
        title: "List",
        items: [],
      });
      this.refresh("Board");
    }

    // item 생성
    createItem(listID) {
      this.model.addItem(listID, {
        id: this.model.createRandomID(),
        title: "Item",
      });
      this.refresh("Board");
    }

    // list 와 item 의 타이틀 변경을 위한 로직
    setTitleEditionEvents(textID, inputID, type) {
      let elementID = textID.split("-")[1];
      let removed = false;

      // title 을 입력할 수 있는 input element 의 show / hide 요소 스위치 이벤트
      this.view.addEvent(textID, "click", () =>
        this.view.showTitleInput(textID, inputID)
      );

      // keyup 이벤트 발생 시 list title 변경
      this.view.addEvent(inputID, "keyup", (e) => {
        if (e.code === "Enter" && type === "list") {
          removed = true;
          this.changeElementTitle(
            type,
            elementID,
            this.view.getElement("#" + inputID).value
          );
        }
      });

      // blur 이벤트 발생 시 title 변경
      this.view.addEvent(inputID, "blur", () => {
        if (!removed) {
          this.changeElementTitle(
            type,
            elementID,
            this.view.getElement("#" + inputID).value
          );
        }
      });
    }

    // element 의 title 변경
    changeElementTitle(type, id, value) {
      if (value === "") {
        if (type === "item") {
          this.model.removeItem(id);
        }
      } else {
        if (type === "list") {
          this.model.updateListTitle(id, value);
        } else if (type === "item") {
          this.model.updateItemTitle(id, value);
        }
      }

      this.refresh("Board");
    }

    // drag event 중 dragstart
    dragStarted(event, id) {
      event.dataTransfer.setData("id", id);
      event.dataTransfer.dropEffect = "move";
      event.currentTarget.style.opacity = "0.6";
    }

    // drag event 중 dragended
    dragEnded(event) {
      if (document.querySelector(".drag-preview")) {
        document.querySelector(".drag-preview").remove();
      }
      event.target.style.opacity = "1";
    }

    // drag event 중 dragenter
    dragEnter(event) {
      if (
        event.dataTransfer.types.includes("id") &&
        !this.isPreview(event.fromElement) &&
        !this.isSelected(event.currentTarget) &&
        !this.previousIsSelected(event.currentTarget)
      ) {
        event.preventDefault();
        event.currentTarget.parentNode.insertBefore(
          this.createDragPreview(),
          event.currentTarget
        );
      }
    }

    isPreview(element) {
      return element && element.className === "drag-preview";
    }

    isSelected(element) {
      return element && element.style && element.style.opacity === "0.6";
    }

    previousIsSelected(element) {
      return (
        Array.from(element.parentNode.children).findIndex(
          (el) => el == element
        ) !== 0 &&
        Array.from(element.parentNode.children)[
          Array.from(element.parentNode.children).findIndex(
            (el) => el == element
          ) - 2
        ].style.opacity === "0.6"
      );
    }

    createDragPreview() {
      document
        .querySelectorAll(".drag-preview")
        .forEach((element) => element.remove());

      let previewElement = document.createElement("div");

      previewElement.className = "drag-preview";
      previewElement.innerHTML = `<div class="dashed"></>`;

      previewElement.ondragover = (event) => event.preventDefault();
      previewElement.ondragleave = (event) => event.currentTarget.remove();
      previewElement.ondrop = (event) => this.dragDropped(event);

      return previewElement;
    }

    dragDropped(event) {
      let sourceItemID = event.dataTransfer.getData("id").split("-")[1];
      let sourceItem = Object.assign({}, this.model.getItem(sourceItemID));
      let targetListID = event.currentTarget.parentNode.id.split("-")[2];

      let targetPosition = this.targetPosition(
        event,
        sourceItemID,
        targetListID
      );

      this.model.removeItem(sourceItemID);
      this.model.insertItem(targetListID, sourceItem, targetPosition);

      this.refresh("Board");
    }

    targetPosition(event, sourceItemID, targetListID) {
      if (this.nextIsItem(event)) {
        let targetItemID = event.currentTarget.nextSibling.id.split("-")[1];
        let sourceListID = this.model.getItemList(sourceItemID).id;

        if (
          targetListID === sourceListID &&
          this.model.getItemIndex(sourceItemID) <
            this.model.getItemIndex(targetItemID)
        ) {
          return this.model.getItemIndex(targetItemID) - 1;
        } else {
          return this.model.getItemIndex(targetItemID);
        }
      } else {
        return this.model.getList(targetListID).items.length;
      }
    }

    nextIsItem(event) {
      return !event.currentTarget.nextSibling.className.includes("add-item");
    }
  }

  window.app = window.app || {};
  window.app.Controller = Controller;
})();
