(function () {
  window.app = window.app || {};
  window.app.Api = { get, post };

  async function get() {
    try {
      let response = await fetch("http://localhost:8080/board");
      return response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function post(board) {
    fetch("http://localhost:8080/board", {
      method: "POST",
      body: JSON.stringify(board),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => console.log("Success:", JSON.stringify(response)))
      .catch((error) => console.error("Error:", error));
  }
})();
