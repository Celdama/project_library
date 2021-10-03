const display = document.getElementById('displayBook');
const cardContent = document.createElement('div');

const myLibrary = [];

class Book {
  constructor(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
  }

  info() {
    return `${this.title} by ${this.author} - ${this.pages}`;
  }
}

const addBookToLibrary = (book) => {
  const bookToAdd = new Book(book.title, book.author, book.pages);
  myLibrary.push(bookToAdd);
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

    title.textContent = book.title;
    author.textContent = book.author;
    pages.textContent = `${book.pages} pages`;

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(pages);

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
  const bookInfo = Array.from(document.querySelectorAll('#formToAddBook input')).reduce((acc, input) => (
    { ...acc, [input.id]: input.value }
  ), {});
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
  bookForm.reset();
});
