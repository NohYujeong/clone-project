(function () {
  class Controller {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.refresh("Board");
    }

    refresh(page) {
      this.view.render(page);
      this.setEvents();
    }

    setEvents() {
      this.view.addEvent("add-list", "click", () => this.createList());

      this.view.getElements(".add-item").forEach((button) => {
        this.view.addEvent(button.id, "click", () =>
          this.createItem(button.id.split("-")[2])
        );
      });

      this.view.getElements(".list-title").forEach((list) => {
        this.setTitleEditionEvents(list.id, list.id + "-input", "list");
      });

      this.view.getElements(".item").forEach((item) => {
        this.setTitleEditionEvents(item.id, item.id + "-input", "item");
        this.view.addEvent(item.id, "dragstart", (event) =>
          this.dragStarted(event, item.id)
        );
        this.view.addEvent(item.id, "dragend", (event) =>
          this.dragEnded(event)
        );
      });

      this.view.getElements(".droppable").forEach((element) => {
        this.view.addEvent(element.id, "dragenter", (event) =>
          this.dragEnter(event)
        );
      });
    }

    createList() {
      this.model.addList({
        id: this.model.createRandomID(),
        title: "List",
        items: [],
      });
      this.refresh("Board");
    }

    createItem(listID) {
      this.model.addItem(listID, {
        id: this.model.createRandomID(),
        title: "Item",
      });
      this.refresh("Board");
    }

    setTitleEditionEvents(textID, inputID, type) {
      let elementID = textID.split("-")[1];

      this.view.addEvent(textID, "click", () =>
        this.view.showTitleInput(textID, inputID)
      );

      this.view.addEvent(inputID, "blur", () =>
        this.changeElementTitle(
          type,
          elementID,
          this.view.getElement("#" + inputID).value
        )
      );

      if (type !== "item") {
        this.view.addEvent(
          inputID,
          "keyup",
          (e) =>
            e.code === "Enter" &&
            this.changeElementTitle(
              type,
              elementID,
              this.view.getElement("#" + inputID).value
            )
        );
      }
    }

    changeElementTitle(type, id, value) {
      if (value === "") {
        if (type !== "item") {
          this.view.setInputError("list-" + id + "-title-input");
        } else {
          this.removeItem(id);
        }
      } else {
        if (type === "list") {
          this.model.updateListTitle(id, value);
        } else if (type === "item") {
          this.model.updateItemTitle(id, value);
        }
        this.refresh("Board");
      }
    }

    dragStarted(event, id) {
      event.dataTransfer.setData("id", id);
      event.dataTransfer.dropEffect = "move";
      event.currentTarget.style.opacity = "0.6";
    }

    dragEnded(event) {
      if (document.querySelector(".drag-preview")) {
        document.querySelector(".drag-preview").remove();
      }
      event.target.style.opacity = "1";
    }

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
