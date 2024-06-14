class Book {
    constructor(id, title, author, publicationYear, availability, maxAllowedDays, isbn) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publicationYear = publicationYear;
        this.availability = availability;
        this.maxAllowedDays = maxAllowedDays;
        this.isbn = isbn;
    }
}

class User {
    constructor(userId, bookId, bookTitle, borrowedDate) {
        this.userId = userId;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.borrowedDate = borrowedDate;
    }
}

// Sample input
let Library = [
    new Book(1, "HarryPotter", "JKRowling", 1997, "Available", 5, 56165216),
];

let person=[
    new User(1,2,"HarryPorter",new Date("2021-10-01"))
];


const searchBookButton = document.querySelector(".search-book-btn");
const borrowBookButton = document.querySelector(".borrow-book-btn");
const returnBookButton = document.querySelector(".return-book-btn");
const availabilityButton =document.querySelector(".check-book-availability-btn");
const dateCheckButton =document.querySelector(".due-date-check-btn");

//validate
function validatePublicationYear(year) {
    return year >= 1995 && year <= 2020;
}
  
function validateISBN(isbn) {
    return isbn.match(/^\d{3}-\d{5}-\d{1,}-\d{3}$/);
}

const addBookForm = document.querySelector(".add-book-form");
// const addBookForm = document.getElementById("add-book-form"); // Assuming the form has an ID of "add-book-form"
addBookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const formData = new FormData(addBookForm);

  const title = formData.get("title");
  const author = formData.get("author");
  const publicationYear = parseInt(formData.get("publicationYear"));
  const maxAllowedDays = formData.get("maxAllowedDays");
  const isbn = formData.get("isbn");

  if (!validatePublicationYear(publicationYear)) {
    alert("Invalid publication year. Book not added.");
    return;
  }
  if (!validateISBN(isbn)) {
    alert("Invalid ISBN. Book not added.");
    return;
  }

  // Add the book to the Library array
  Library.push(new Book(
    Library.length + 1, // Assuming IDs start from 1 and increment by 1
    title,
    author,
    publicationYear,
    "Available", // Newly added book is available by default
    maxAllowedDays,
    isbn
  ));

  // Display a success message
  alert("Book added successfully!");

  // Reset the form
  addBookForm.reset();
});


function searchBook(bookDetail) {
    if (bookDetail.length === 0) {
        alert("Selected Items are not in menu or delivery address is not provided");
        return; // Exit the function early if conditions are not met
    }

    const [title, author, year] = bookDetail.match(/\S+/g); // Using a regular expression to match non-space characters
    const book = Library.find(book =>
        book.title.toLowerCase() === title.toLowerCase() &&
        book.author.toLowerCase() === author.toLowerCase() &&
        book.publicationYear === parseInt(year)
    );

    if (book) {
        if (book.availability.toLowerCase() === "available") {
            displayBook([book]); // Pass an array containing the found book to displayBook function
        } 
        else {
            // Instead of throwing an error, display a message indicating that the book is not available
            alert(`The book "${book.title}" is not available.`);
        }

    } 
    else {
        // Display a message indicating that the book is not found
        alert("Book not found.");
    }
}



searchBookButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const bookDetail = document.querySelector(".search-book").value;
    searchBook(bookDetail);
});


// BOOK WILL DISPLAY 
async function displayBook(bookDetail) {
    // await delay();
    const bookDisplay = document.querySelector(".search-result");
    bookDisplay.innerHTML = "";

    if (bookDetail.length === 0) {
        bookDisplay.innerHTML = "<p>No Book Found</p>";
        return;
    }

    const heading = document.createElement("h2");
    heading.textContent = "book";
    const table = document.createElement("table");
    table.innerHTML = `<thead><tr>
                       <th>Id</th>
                       <th>Title</th>
                       <th>Author</th>
                       <th>Publication Year</th>
                       <th>Availability</th>
                       <th>Max Allowed Days</th>
                       <th>ISBN</th>
                       </tr></thead>
                       <tbody>    
                       ${bookDetail.map(item => `<tr>
                                                  <td>${item.id}</td>
                                                  <td>${item.title}</td>
                                                  <td>${item.author}</td>
                                                  <td>${item.publicationYear}</td>
                                                  <td>${item.availability}</td>
                                                  <td>${item.maxAllowedDays}</td>
                                                  <td>${item.isbn}</td>
                                                  </tr>`).join('')}</tbody>`; 
    // with the help of map a new array well created   
    bookDisplay.append(heading);
    bookDisplay.append(table);
}

// async function BorrowBookById(id) {
//     // await delay();
//     }
function BorrowBookById(id) {
    const bookToBorrow = Library.find((book) => book.id === id);

    if (bookToBorrow && bookToBorrow.availability.toLowerCase() === "available") {
        bookToBorrow.availability = "unavailable";

        const borrowedBook = new User(
            person.length + 1,
            bookToBorrow.id,
            bookToBorrow.title,
            new Date()
        );
        person.push(borrowedBook);

        // Update the availability in the Library array as well
        Library.find(book => book.id === id).availability = "unavailable";

        return true;
    } else {
        return false;
    }
}



borrowBookButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const borrowId = parseInt(document.querySelector(".borrow-book").value); // Convert to integer
    const success = BorrowBookById(borrowId);
    if (success) {
        alert("Book borrowed successfully!");
    } 
    else {
        alert("Book is not available for borrowing.");
    }
});

async function ReturnbooksByISBN(isbn) {
    const bookToReturn = Library.find(book => book.isbn === isbn);

    if (bookToReturn && bookToReturn.availability.toLowerCase() === "unavailable") {
        bookToReturn.availability = "available";

        // Remove the book from the person array
        const index = person.findIndex(user => user.bookId === bookToReturn.id);
        if (index !== -1) {
            person.splice(index, 1);
        }
        
        return true;
    } else {
        return false;
    }
}


returnBookButton.addEventListener("click", (event) => {
    event.preventDefault();
    const isbn = parseInt(document.querySelector(".return-book").value);
    const success = ReturnbooksByISBN(isbn);
    if (success) {
        alert("Book returned successfully!");
        // Refresh the book display
        const bookDetail = document.querySelector(".search-book").value;
        searchBook(bookDetail);
    } else {
        alert("Book with the entered ISBN is either not found or already available.");
    }
});
   
async function BookAvailabilityCheck(event) {
    event.preventDefault();
    const query = document.querySelector(".check-book-availability").value;
    const book = Library.find(item => item.id === parseInt(query) || item.title.toLowerCase() === query.toLowerCase());
    if (book) {
        alert(`Book "${book.title}" is ${book.availability.toLowerCase()}.`);
    } else {
        alert("Book not found.");
    }
}

availabilityButton.addEventListener("click", BookAvailabilityCheck);

// async function DueDateCheck(){
  
// }

async function DueDateCheck(event) {
    event.preventDefault();

    // Get the book ID or title entered by the user
    const query = document.querySelector(".due-date-check").value.trim().toLowerCase();

    // Find the user's borrowed book by ID or title
    const borrowedBook = person.find(user => user.bookId === parseInt(query) || user.bookTitle.toLowerCase() === query);

    if (borrowedBook) {
        // Calculate the due date by adding 5 days to the borrowed date
        const borrowedDate = new Date(borrowedBook.borrowedDate);
        const dueDate = new Date(borrowedDate);
        dueDate.setDate(dueDate.getDate() + 5);

        // Get the current date
        const currentDate = new Date();

        // Check if the current date is after the due date
        if (currentDate > dueDate) {
            // Calculate the number of days overdue
            const daysOverdue = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));
            alert(`The book "${borrowedBook.bookTitle}" is overdue by ${daysOverdue} days.`);
        } else {
            alert(`The book "${borrowedBook.bookTitle}" is not overdue.`);
        }
    } else {
        alert("Book not found.");
    }
}


// Attach DueDateCheck to the correct button
dateCheckButton.addEventListener("click", DueDateCheck);

