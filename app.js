const display = document.getElementById('displayBook');
const cardContent = document.createElement('div');

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
  const bookToAdd = new Book(book.title, book.author, book.pages, book.isRead);
  myLibrary.push(bookToAdd);
  // console.log(myLibrary);
};

const toggleReadStatus = () => {
  // console.log('toggle');
};

const displayBook = () => {
  // seul solution trouvée pour l'instant pour éviter la dupplication d'élément dans mon display
  cardContent.textContent = '';
  myLibrary.forEach((book) => {
    const card = document.createElement('div');
    card.classList.add('book-card');
    cardContent.classList.add('card-content');
    const title = document.createElement('h2');
    const author = document.createElement('p');
    const pages = document.createElement('p');
    const read = document.createElement('p');
    const toggleRead = document.createElement('button');

    title.textContent = book.title;
    author.textContent = `by: ${book.author}`;
    pages.textContent = `pages: ${book.pages}`;
    book.isRead
      ? read.textContent = 'already read'
      : read.textContent = 'not read yet';
    toggleRead.textContent = 'toggle read';

    toggleRead.addEventListener('click', toggleReadStatus());

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(pages);
    card.appendChild(read);
    card.appendChild(toggleRead);

    cardContent.appendChild(card);
    display.appendChild(cardContent);
  });
};

const addBookFormBtn = document.getElementById('showBookFormBtn');
const addBookForm = document.getElementById('myForm');
const closeBookFormBtn = document.getElementById('closeBookFormBtn');
const bookForm = document.getElementById('formToAddBook');

const openForm = () => {
  addBookForm.style.display = 'block';
};

const closeForm = () => {
  addBookForm.style.display = 'none';
};

const getBookInfo = () => {
  const bookInfo = Array.from(document.querySelectorAll('#formToAddBook input'))
    .reduce((acc, input) => (
      { ...acc, [input.id]: input.value }
    ), {});

  const isReaded = document.querySelector('#formToAddBook input:checked');

  if (isReaded.value === 'true') {
    bookInfo.isRead = true;
  } else {
    bookInfo.isRead = false;
  }

  return bookInfo;
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
