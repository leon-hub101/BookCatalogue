let bookCat = [];

function checkLoad() {
  if (sessionStorage.getItem("hasCodeRunBefore") === null) {
    sessionStorage.setItem("bookCatalogue", JSON.stringify(bookCat));
    sessionStorage.setItem("hasCodeRunBefore", true);
  } else {
    bookCat = JSON.parse(sessionStorage.getItem("bookCatalogue"));
    displayBooks();
  }
}

function book(title, first, last, about, genre, review) {
  this.title = title || "";
  this.author = {
    first: first || "",
    last: last || "",
  };
  this.about = about || "";
  this.genre = genre || "";
  this.review = review || "";
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoad();
  document.querySelector(".addButton").addEventListener("click", addOrEditBook); // Use addOrEditBook here
});

function addOrEditBook(event) {
  console.log("addOrEditBook function was triggered.");
  event.preventDefault(); // Prevent the form from submitting in the traditional way
  const mode = document.getElementById("formMode").value;
  const index =
    mode === "edit"
      ? parseInt(document.getElementById("editIndex").value)
      : null;

  let newBook = new book(
    document.getElementById("title").value || "",
    document.getElementById("authorFname").value || "",
    document.getElementById("authorLname").value || "",
    document.getElementById("authorBio").value || "",
    document.getElementById("genre").value || "",
    document.getElementById("reviews").value || ""
  );

  if (mode === "edit" && typeof index === "number") {
    bookCat[index] = newBook;
  } else {
    bookCat.push(newBook);
  }

  sessionStorage.setItem("bookCatalogue", JSON.stringify(bookCat));
  displayBooks();
  document.getElementById("bookForm").reset();
  resetFormState();
}

function editBook(index) {
  console.log("editBook function was triggered.");
  const book = bookCat[index];
  //console.log("editBook:.", book);

  // Populate the form fields with the book's details
  document.getElementById("title").value = book.title || "";
  document.getElementById("authorFname").value = book.author.first || "";
  console.log(document.getElementById("authorLname"));
  document.getElementById("authorLname").value = book.author.last || "";
  document.getElementById("authorBio").value = book.about || "";
  document.getElementById("genre").value = book.genre || "";
  document.getElementById("reviews").value = book.review || "";

  // Switch the form to "edit" mode
  document.getElementById("formMode").value = "edit";
  document.getElementById("editIndex").value = index.toString(); // Store the index of the book being edited

  document.querySelector(".addButton").textContent = "Update Book";
  document.getElementById("editModeMessage").style.display = "block";
}

function resetFormState() {
  document.getElementById("formMode").value = "add";
  document.getElementById("editIndex").value = "";
  document.querySelector(".addButton").textContent =
    "Save your book to the catalogue";
  document.getElementById("editModeMessage").style.display = "none";
}

function displayBooks() {
  const bookListElement = document.getElementById("bookList");
  bookListElement.innerHTML = "";

  bookCat.forEach((book, index) => {
    const bookElement = document.createElement("li");
    bookElement.innerHTML = `Title: ${book.title}, Author: ${book.author.first} ${book.author.last}, About the author: ${book.about}, Genre: ${book.genre}, Review: ${book.review}`;

    // Close (delete) button
    let span = document.createElement("span");
    span.textContent = " \u00D7";
    span.classList.add("close");
    (function (index) {
      span.onclick = function () {
        bookCat.splice(index, 1);
        sessionStorage.setItem("bookCatalogue", JSON.stringify(bookCat));
        displayBooks();
      };
    })(index); // Pass the current `index` to the IIFE

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    (function (index) {
      editButton.onclick = function () {
        editBook(index);
      };
    })(index); // Pass the current `index` to the IIFE

    bookElement.appendChild(editButton);
    bookElement.appendChild(span);
    bookListElement.appendChild(bookElement);
  });
}
