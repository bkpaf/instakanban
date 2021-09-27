import Kanban from "./view/Kanban.js";

new Kanban(document.querySelector(".kanban"));

fetch("https://type.fit/api/quotes")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    let motivational = data;
    console.log(data);
    document.querySelector(".motivational").addEventListener("click", () => {
      let i = Math.floor(Math.random() * 1643 + 1);
      let quote = motivational[i].text;
      let author = motivational[i].author;

      if (!author) {
        author = "Unknown";
      }
      document.querySelector(".motivation").textContent = `${quote}`;
      document.querySelector(".author").textContent = `${author}`;
    });
  });
