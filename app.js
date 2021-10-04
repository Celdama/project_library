const display = document.getElementById('displayBook');
const cardContent = document.createElement('div');
const addBookFormBtn = document.getElementById('showBookFormBtn');
const addBookForm = document.getElementById('myForm');
const closeBookFormBtn = document.getElementById('closeBookFormBtn');
const bookForm = document.getElementById('formToAddBook');

const myLibrary = [];

class Book {
  constructor(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
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
  const readPara = document.querySelectorAll('.read-statut');
  bookToToggle.isRead = !book.isRead;
  displayReadStatus(readPara[index], bookToToggle.isRead);
};

const displayBook = () => {
  // seul solution trouvée pour l'instant pour éviter la dupplication d'élément dans mon display
  cardContent.textContent = '';
  myLibrary.forEach((book, index) => {
    const bookCard = document.createElement('div');
    const bookTitle = document.createElement('h2');
    const bookAuthor = document.createElement('p');
    const bookPages = document.createElement('p');
    const displayReadStatusPara = document.createElement('p');
    const toggleReadStatusBtn = document.createElement('button');
    bookCard.classList.add('book-card');
    cardContent.classList.add('card-content');
    displayReadStatusPara.classList.add('read-statut');

    bookTitle.textContent = book.title;
    bookAuthor.textContent = `by: ${book.author}`;
    bookPages.textContent = `pages: ${book.pages}`;

    displayReadStatus(displayReadStatusPara, book.isRead);

    toggleReadStatusBtn.textContent = 'toggle read';

    toggleReadStatusBtn.addEventListener('click', () => {
      toggleReadStatus(myLibrary[index], index);
    });

    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(bookPages);
    bookCard.appendChild(displayReadStatusPara);
    bookCard.appendChild(toggleReadStatusBtn);

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

addBookFormBtn.addEventListener('click', () => openForm());
closeBookFormBtn.addEventListener('click', () => closeForm());

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  getBookInfo();
  const newBook = getBookInfo();
  addBookToLibrary(newBook);
  displayBook();
  // bookForm.reset();
});
