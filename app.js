const display = document.getElementById('displayBook');
const cardContent = document.createElement('div');
const addBookFormBtn = document.getElementById('showBookFormBtn');
const addBookForm = document.getElementById('myForm');
const closeBookFormBtn = document.getElementById('closeBookFormBtn');
const bookForm = document.getElementById('formToAddBook');
cardContent.classList.add('card-content');

let myLibrary = [];

class Book {
  constructor(title, author, pages, isRead, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.id = id || null;
  }

  info() {
    return `${this.title} by ${this.author} - ${this.pages} pages`;
  }
}

const addBookToLibrary = (book) => {
  const newBook = new Book(book.title, book.author, book.pages, book.isRead);
  myLibrary.push(newBook);
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

const elementFactory = (type, text, className, parent) => {
  const el = document.createElement(type);
  el.textContent = text;
  el.classList.add(`${className}`);
  parent.appendChild(el);

  return {
    el,
  };
};

const displayBook = () => {
  // seul solution trouvée pour l'instant pour éviter la dupplication d'élément dans mon display
  cardContent.textContent = '';
  myLibrary.forEach((book, index) => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.dataset.id = index;
    const bookTitle = elementFactory('h2', book.title, 'book-title', bookCard);
    const bookAuthor = elementFactory('p', book.author, 'book-author', bookCard);
    const bookPages = elementFactory('p', book.pages, 'book-pages', bookCard);
    const displayReadStatusPara = elementFactory('p', '', 'read-status', bookCard);
    const deleteBookBtn = elementFactory('button', 'X', 'delete-book', bookCard);
    const toggleReadStatusBtn = elementFactory('button', 'read', 'toggle-read-btn', bookCard);

    displayReadStatus(displayReadStatusPara.el, book.isRead);

    toggleReadStatusBtn.el.addEventListener('click', () => {
      toggleReadStatus(myLibrary[index], index);
    });

    deleteBookBtn.el.addEventListener('click', () => {
      deleteBook(index);
      displayBook();
      saveToLocalStorage();
    });

    cardContent.appendChild(bookCard);
    display.appendChild(cardContent);
  });
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
