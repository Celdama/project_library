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
  constructor(title, author, pages, pagesRead, coverURL, isRead, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.pagesRead = pagesRead || 0;
    this.coverURL = coverURL;
    this.isRead = isRead;
    this.id = id || null;
  }

  info() {
    return `${this.title} by ${this.author} - ${this.pages} pages`;
  }
}

const addBookToLibrary = (book) => {
  const newBook = new Book(book.title, book.author,
    book.pages, book.pagesRead, book.coverURL, book.isRead);
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
  bookToToggle.isRead = !book.isRead;
  bookToToggle.pagesRead = bookToToggle.pages;
  displayLibraryLog(myLibrary);
  displayBook();
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

const percentReadStatus = (allPages, readPage) => ((readPage / allPages) * 100).toFixed();

const displayBook = () => {
  // seul solution trouvée pour l'instant pour éviter la dupplication d'élément dans mon display
  cardContent.textContent = '';
  myLibrary.forEach((book, index) => {
    const percent = percentReadStatus(book.pages, book.pagesRead);

    const bookCard = elementFactory('div', '', 'book-card');
    const bookCover = elementFactory('div', '', 'book-cover');
    const bookContent = elementFactory('div', '', 'book-content');
    const bookInfo = elementFactory('div', '', 'book-info');
    const bookTitle = elementFactory('h2', book.title, 'book-title');
    const bookAuthor = elementFactory('p', book.author, 'book-author');
    const bookPages = elementFactory('p', book.pages, 'book-pages');
    const bookProgress = elementFactory('div', '', 'book-progress');
    const bookProgressBar = elementFactory('div', '', 'book-progress-bar');
    const bookProgressBarMeter = elementFactory('span', '', 'book-progress-bar-meter');
    const bookProgressPercent = elementFactory('p', `${percent}%`, 'book-progress-percent');
    // const displayReadStatusPara = elementFactory('p', '', 'read-status');
    const deleteBookBtn = elementFactory('button', 'X', 'delete-book');
    const toggleReadStatusBtn = elementFactory('button', 'read', 'toggle-read-btn');

    bookCover.el.style.backgroundImage = `url(${book.coverURL})`;
    bookCover.el.style.backgroundSize = 'cover';
    bookCover.el.style.backgroundPosition = 'center';

    bookProgressBarMeter.el.style.width = `${percent}%`;

    bookProgressBarMeter.el.style.backgroundColor = percent === '100' ? '#007f5f' : '#ffd60a';

    appendElementToParent(bookProgressBar.el, bookProgressBarMeter);

    appendElementToParent(bookProgress.el, bookProgressBar, bookProgressPercent);

    appendElementToParent(bookInfo.el, bookAuthor,
      bookProgress, deleteBookBtn, toggleReadStatusBtn);

    appendElementToParent(bookContent.el, bookTitle, bookInfo);

    appendElementToParent(bookCard.el, bookCover, bookContent);

    // displayReadStatus(displayReadStatusPara.el, book.isRead);

    toggleReadStatusBtn.el.addEventListener('click', () => {
      toggleReadStatus(myLibrary[index], index);
      saveToLocalStorage();
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
  bookForm.reset();
  resetAllSpanError();
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

const showError = (element, display) => {
  if (element.id === 'title') {
    if (element.validity.valueMissing) {
      display.textContent = 'You need to enter an title book';
    } else if (element.validity.typeMismatch) {
      display.textContent = 'Entered value need this';
    } else if (element.validity.tooShort) {
      display.textContent = `title should be ${element.minLength}`;
    }
  } else if (element.id === 'author') {
    if (element.validity.valueMissing) {
      display.textContent = 'You need to enter an author book';
    } else if (element.validity.typeMismatch) {
      display.textContent = 'Entered value need this';
    } else if (element.validity.tooShort) {
      display.textContent = `author should be ${element.minLength}`;
    }
  } else if (element.id === 'coverURL') {
    if (element.validity.valueMissing) {
      display.textContent = 'You need to enter an url';
    } else if (element.validity.typeMismatch) {
      display.textContent = 'Entered value need to be an url. eg: "https://www.mycover...."';
    } else if (element.validity.tooShort) {
      display.textContent = `coverURL should be ${element.minLength}`;
    }
  } else if (element.id === 'pages') {
    if (element.validity.valueMissing) {
      display.textContent = 'You have to add a number of pages';
    } else if (element.validity.typeMismatch) {
      display.textContent = 'entered a num';
    } else if (element.validity.rangeUnderflow) {
      display.textContent = `num of pages should be ${element.min} at least`;
    }
  } else if (element.id === 'pagesRead') {
    if (element.validity.valueMissing) {
      display.textContent = 'You have to add a number of completed pages';
    } else if (element.validity.typeMismatch) {
      display.textContent = 'entered a num';
    } else if (element.validity.rangeOverflow) {
      display.textContent = 'num of completed pages cannot be greater than num of pages';
    }
  }
  display.className = 'error active';
};

// ELEMENT FOR FORM VALIDATION
const title = document.getElementById('title');
const titleError = document.querySelector('#title + span.error');
const author = document.getElementById('author');
const authorError = document.querySelector('#author + span.error');
const coverURL = document.getElementById('coverURL');
const coverError = document.querySelector('#coverURL + span.error');
const pages = document.getElementById('pages');
const pagesError = document.querySelector('#pages + span.error');
const pagesRead = document.getElementById('pagesRead');
const pagesReadError = document.querySelector('#pagesRead + span.error');
// END ELEMENT FOR FORM VALIDATION

const resetAllSpanError = () => {
  const allSpansError = [titleError, authorError, coverError, pagesError, pagesReadError];

  allSpansError.forEach((span) => {
    span.textContent = '';
    span.className = 'error';
  });
};

const testTitleFormValidity = () => {
  title.addEventListener('input', () => {
    if (title.validity.valid) {
      titleError.textContent = '';
      titleError.className = 'error';
    } else {
      showError(title, titleError);
    }
  });
};

const testAuthorFormValidity = () => {
  author.addEventListener('input', () => {
    if (author.validity.valid) {
      authorError.textContent = '';
      authorError.className = 'error';
    } else {
      showError(author, authorError);
    }
  });
};

const testCoverURLFormValidity = () => {
  coverURL.addEventListener('input', () => {
    if (coverURL.validity.valid) {
      coverError.textContent = '';
      coverError.className = 'error';
    } else {
      showError(coverURL, coverError);
    }
  });
};

const testPagesFormValidity = () => {
  pages.addEventListener('input', () => {
    pagesRead.setAttribute('max', `${pages.value}`);
    if (pages.validity.valid) {
      pagesError.textContent = '';
      pagesError.className = 'error';
    } else {
      showError(pages, pagesError);
    }
  });
};

const testPagesReadFormValidity = () => {
  pagesRead.addEventListener('input', () => {
    if (pagesRead.validity.valid) {
      pagesReadError.textContent = '';
      pagesReadError.className = 'error';
    } else {
      showError(pagesRead, pagesReadError);
    }
  });
};

addBookFormBtn.addEventListener('click', () => openForm());
closeBookFormBtn.addEventListener('click', () => closeForm());

bookForm.addEventListener('submit', (e) => {
  if (!title.validity.valid) {
    showError(title, titleError);
    e.preventDefault();
  } else if (!author.validity.valid) {
    showError(author, authorError);
    e.preventDefault();
  } else if (!coverURL.validity.valid) {
    showError(coverURL, coverError);
    e.preventDefault();
  } else if (!pages.validity.valid) {
    showError(pages, pagesError);
    e.preventDefault();
  } else if (!pagesRead.validity.valid) {
    showError(pagesRead, pagesReadError);
    e.preventDefault();
  } else {
    addBookToLibrary(getBookInfo());
    setBookId();
    saveToLocalStorage();
    displayBook();
    bookForm.reset();
  }
});

window.onload = retrieveDataFromLocalStorage();

window.onload = testTitleFormValidity();
window.onload = testAuthorFormValidity();
window.onload = testCoverURLFormValidity();
window.onload = testPagesFormValidity();
window.onload = testPagesReadFormValidity();
