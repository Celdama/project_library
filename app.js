const display = document.getElementById('display-book');

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
  myLibrary.push(book);
};

const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295);
const deepWork = new Book('Deep Work', 'Cal Newport', 345);
const work = new Book('Work', 'James Suzman', 456);
const minimalism = new Book('Minimalism', 'Joshua Millburn', 232);
const goodByeThings = new Book('GoodBye Things', 'Fumio Sasaki', 123);

addBookToLibrary(theHobbit);
addBookToLibrary(deepWork);
addBookToLibrary(work);
addBookToLibrary(minimalism);
addBookToLibrary(goodByeThings);

const displayBook = () => {
  myLibrary.forEach((book) => {
    const card = document.createElement('div');
    card.classList.add('book-card');
    const title = document.createElement('h2');
    const author = document.createElement('p');
    const pages = document.createElement('p');

    title.textContent = book.title;
    author.textContent = book.author;
    pages.textContent = `${book.pages} pages`;

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(pages);

    display.appendChild(card);
  });
};

displayBook();
