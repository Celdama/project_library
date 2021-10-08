const display = document.getElementById('display-book-library');
const cardContent = document.createElement('div');
const addBookFormBtn = document.getElementById('showBookFormBtn');
const addBookForm = document.getElementById('myForm');
const closeBookFormBtn = document.getElementById('closeBookFormBtn');
const bookForm = document.getElementById('formToAddBook');
const totalBooks = document.getElementById('total-books');
const totalBooksRead = document.getElementById('total-books-read');
const totalBooksUnread = document.getElementById('totak-books-unread');

cardContent.classList.add('card-content');

let myLibrary = [];

class Book {
  constructor(title, author, pages, coverURL, isRead, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.coverURL = coverURL;
    this.isRead = isRead;
    this.id = id || null;
  }

  info() {
    return `${this.title} by ${this.author} - ${this.pages} pages`;
  }
}

const addBookToLibrary = (book) => {
  const newBook = new Book(book.title, book.author, book.pages, book.coverURL, book.isRead);
  myLibrary.push(newBook);
};

const displayLibraryLog = (books) => {
  let sumtotalBooks = 0;
  let sumTotalBooksRead = 0;
  let sumtotalBooksUnread = 0;

  books.forEach((book) => {
    sumtotalBooks += 1;
    if (book.isRead) {
      sumTotalBooksRead += 1;
    } else {
      sumtotalBooksUnread += 1;
    }
  });

  totalBooks.textContent = `Total books : ${sumtotalBooks}`;
  totalBooksRead.textContent = `Read : ${sumTotalBooksRead}`;
  totalBooksUnread.textContent = `Not Read : ${sumtotalBooksUnread}`;
};

const displayReadStatus = (div, read) => {
  const displayReadStatusPara = div;

  if (read) {
    displayReadStatusPara.textContent = 'read';
  } else {
    displayReadStatusPara.textContent = 'not read yet';
  }

  return displayReadStatusPara;
};

const toggleReadStatus = (book, index) => {
  const bookToToggle = book;
  // j'utilise l'index pour cibler le bon <p> et
  // modifier le textContent dans la fonction displayReadStatus
  const readPara = document.querySelectorAll('.read-status');
  bookToToggle.isRead = !book.isRead;

  displayReadStatus(readPara[index], bookToToggle.isRead);
  displayLibraryLog(myLibrary);
};

const setBookId = () => {
  myLibrary.forEach((book, index) => {
    book.id = index;
  });
};

const deleteBook = (index) => {
  myLibrary.splice(index, 1);
};

const saveToLocalStorage = () => {
  localStorage.setItem('myLibraryInLocalStorage', JSON.stringify(myLibrary));
};

const elementFactory = (type, text, className) => {
  const el = document.createElement(type);
  el.textContent = text;
  el.classList.add(`${className}`);

  return {
    el,
  };
};

const appendElementToParent = (parent, ...args) => {
  args.forEach((arg) => {
    parent.appendChild(arg.el);
  });
};

const displayBook = () => {
  // seul solution trouvée pour l'instant pour éviter la dupplication d'élément dans mon display
  cardContent.textContent = '';
  myLibrary.forEach((book, index) => {
    const bookCard = elementFactory('div', '', 'book-card');
    const bookCover = elementFactory('div', '', 'book-cover');
    const bookContent = elementFactory('div', '', 'book-content');
    const bookTitle = elementFactory('h2', book.title, 'book-title');
    const bookAuthor = elementFactory('p', book.author, 'book-author');
    const bookPages = elementFactory('p', book.pages, 'book-pages');
    const displayReadStatusPara = elementFactory('p', '', 'read-status');
    const deleteBookBtn = elementFactory('button', 'X', 'delete-book');
    const toggleReadStatusBtn = elementFactory('button', 'read', 'toggle-read-btn');

    bookCover.el.style.backgroundImage = `url(${book.coverURL})`;
    bookCover.el.style.backgroundSize = 'cover';

    appendElementToParent(bookContent.el, bookTitle, bookAuthor,
      displayReadStatusPara, deleteBookBtn, toggleReadStatusBtn);

    appendElementToParent(bookCard.el, bookCover, bookContent);

    displayReadStatus(displayReadStatusPara.el, book.isRead);

    toggleReadStatusBtn.el.addEventListener('click', () => {
      toggleReadStatus(myLibrary[index], index);
    });

    deleteBookBtn.el.addEventListener('click', () => {
      deleteBook(index);
      displayBook();
      saveToLocalStorage();
    });

    cardContent.appendChild(bookCard.el);
    display.appendChild(cardContent);
  });
  displayLibraryLog(myLibrary);
};

const openForm = () => {
  addBookForm.style.display = 'block';
};

const closeForm = () => {
  addBookForm.style.display = 'none';
};

const getBookInfo = () => {
  const newBookInfo = Array.from(document.querySelectorAll('#formToAddBook input'))
    .reduce((acc, input) => (
      { ...acc, [input.id]: input.value }
    ), {});

  const isReaded = document.querySelector('#formToAddBook input:checked');

  if (isReaded.value === 'true') {
    newBookInfo.isRead = true;
  } else {
    newBookInfo.isRead = false;
  }

  return newBookInfo;
};

const retrieveDataFromLocalStorage = () => {
  myLibrary = localStorage.getItem('myLibraryInLocalStorage');
  myLibrary = JSON.parse(myLibrary);

  if (myLibrary === null) {
    // local storage empty, donc je réassigne myLibrary en
    // tant qu'array pour éviter des bugs quand je dois ajouter des books à ce tableau
    myLibrary = [];
  } else {
    displayBook();
  }
};

addBookFormBtn.addEventListener('click', () => openForm());
closeBookFormBtn.addEventListener('click', () => closeForm());

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addBookToLibrary(getBookInfo());
  setBookId();
  saveToLocalStorage();
  displayBook();
  bookForm.reset();
});

window.onload = retrieveDataFromLocalStorage();
