const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).json(books);
});

// Task 2: Get the books based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get all books by Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);
  res.status(200).json(filteredBooks);
});

// Task 4: Get all books based on Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);
  res.status(200).json(filteredBooks);
});

// Task 5: Get book Review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 6: Register New user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (username && password && isValid(username)) {
    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// Task 10: Get all books – Using async callback function
public_users.get('/async/books', async (req, res) => {
  // Simulate async operation with setTimeout
  setTimeout(() => {
    res.status(200).json(books);
  }, 1000); // 1-second delay to simulate async operation
});

// Task 11: Search by ISBN – Using Promises
public_users.get('/async/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(book => {
    res.status(200).json(book);
  })
  .catch(error => {
    res.status(404).json({ message: error });
  });
});

// Task 12: Search by Author – Using async/await
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 13: Search by Title – Using async/await
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

module.exports.general = public_users;
