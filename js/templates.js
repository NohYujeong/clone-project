(function () {
  window.app = window.app || {};
  window.app.Templates = { Board };

  function Board(lists) {
    return `<div>
              <header class="navbar">Task Board</header>
              <main class="main-container">
                <div class="lists-wrapper">
                  ${lists.reduce((acc, list) => (acc += List(list)), "")}
                  <div class="add-list-wrapper">
                    <button type="button" id="add-list" class="add-list">Add a list...</button>
                  </div>
                </div>
              </main>
            </div>`;
  }

  function List({ id, title, items }) {
    return `<div class="list">
              <div class="list-header">
                <h4 id="list-${id}-title" class="show list-title">${title}</h4>
                <input id="list-${id}-title-input" type="text" class="hide list-title-input" value="${title}" placeholder="Title" />
              </div>
              <div id="items-container-${id}" class="padding items-container">
                ${items.reduce((acc, item) => (acc += Item(item)), "")}
                <button id="add-item-${id}" class="color-info add-item droppable">Add a item</button>
              </div>
            </div>`;
  }

  function Item({ id, title }) {
    return `<div id="item-${id}-title" class="item show droppable" draggable="true">
              <p>${title}</p>
            </div>
            <textarea id="item-${id}-title-input" class="hide item-input">${title}</textarea>`;
  }
})();
