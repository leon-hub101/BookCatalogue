let bookCat = []; //Array of the user's books

//Event listener that initiates checkLoad and click event listener once the html page has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  checkLoad();
  document.querySelector(".addButton").addEventListener("click", addOrEditBook);
});

/*Function to check if the page has loaded before:
if not, it initializes sessionStorage with an empty array and sets has run before to true.
if yes, it loads the existing array from sessionStorage and populates the page with the content*/
function checkLoad() {
  if (sessionStorage.getItem("hasCodeRunBefore") === null) {
    sessionStorage.setItem("bookCatalogue", JSON.stringify(bookCat));
    sessionStorage.setItem("hasCodeRunBefore", true);
  } else {
    bookCat = JSON.parse(sessionStorage.getItem("bookCatalogue"));
    displayBooks();
  }
}

//Constructor for future book objects
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

/*This function is bound to the click event listener and executes on click 
of the button element. I had to add a preventDefault funtion because I was 
getting unwanted default behaviour when the functioin was called. 
I created two modes; Add and Edit mode. The function checks which
mode the program is in and executes functionality accordingly.

We initialize a new book object: 
If in Add mode, we populate the bookCatalogue array with the user's book data.
If in Edit mode, we look which index the book is that is being edited, we populate the forms
with this book's data and set that book equal to the new book object thus updating the array. 

Btw, the functionality to populate the form is handled in the editBook function. 
----SO the addOrEditBook function adds the new book object or the edited---- 
----book object to the array WHILE the editBook function sets up the--------
----forms for editing and changes the mode from add book to edit book.------

The addOrEditBook function ends by updating the sessionStorage and the array
and resetting (clearing) the forms and resetting the form state to add.
------------This is handled in the resetFormState function------------*/

function addOrEditBook(event) {
  event.preventDefault(); // Prevent the form from executing default behaviour
  /* Check's which mode the program is in - if edit mode it identifies 
  the index of the book being edited*/
  const mode = document.getElementById("formMode").value;
  const index =
    mode === "edit"
      ? parseInt(document.getElementById("editIndex").value)
      : null;

  // Initializes a new book object
  let newBook = new book(
    document.getElementById("title").value || "",
    document.getElementById("authorFname").value || "",
    document.getElementById("authorLname").value || "",
    document.getElementById("authorBio").value || "",
    document.getElementById("genre").value || "",
    document.getElementById("reviews").value || ""
  );
  // Operations for either edit mode or add mode
  if (mode === "edit" && typeof index === "number") {
    bookCat[index] = newBook;
  } else {
    bookCat.push(newBook);
  }
  // Updates sessionStorage and book array and resets forms and state
  sessionStorage.setItem("bookCatalogue", JSON.stringify(bookCat));
  displayBooks();
  document.getElementById("bookForm").reset();
  resetFormState();
}

/* Bound to the edit button event. When triggered it populates the form with the specific book
and switches the form state to edit. This updates the button to "update book"*/
function editBook(index) {
  event.preventDefault(); // Prevent the form from executing default behaviour. This was key in getting this program to run properly!! Took two days to figure out why it wasn't running the way it should. Ends up the program was executing default behaviour and not populating the forms in edit mode...
  const book = bookCat[index];

  // Populate the form fields with the book's details
  document.getElementById("title").value = book.title || "";
  document.getElementById("authorFname").value = book.author.first || "";
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

/* Function to reset the form state from edit mode to add mode and the add button from
update to save...*/
function resetFormState() {
  document.getElementById("formMode").value = "add";
  document.getElementById("editIndex").value = "";
  document.querySelector(".addButton").textContent =
    "Save your book to the catalogue";
  document.getElementById("editModeMessage").style.display = "none";
}

/* Sets the display of the books to the screen. Here I added an x for deleting a book, 
and the edit button*/
function displayBooks() {
  const bookListElement = document.getElementById("bookList");
  bookListElement.innerHTML = "";

  bookCat.forEach((book, index) => {
    const bookElement = document.createElement("li");
    bookElement.innerHTML = `Title: ${book.title}, Author: ${book.author.first} ${book.author.last}, About the author: ${book.about}, Genre: ${book.genre}, Review: ${book.review}`;
  });
  // Close (delete) button
  let span = document.createElement("span");
  span.textContent = " \u00D7";
  span.classList.add("close");
  span.addEventListener("click", function (event) {
    bookCat.splice(index, 1);
    sessionStorage.setItem("bookCatalogue", JSON.stringify(bookCat));
    displayBooks();
  });

  // Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", function (event) {
    event.preventDefault();
    editBook(index);
  });

  bookElement.appendChild(editButton);
  bookElement.appendChild(span);
  bookListElement.appendChild(bookElement);
}
