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

addBookToLibrary(theHobbit);
addBookToLibrary(deepWork);
addBookToLibrary(work);
addBookToLibrary(minimalism);

console.table(myLibrary);
