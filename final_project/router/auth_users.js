const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Task 7: Login as a Registered user
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ message: "Customer logged in successfully", token: token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Task 8: Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const { username } = req.user; // assume we have the username from JWT payload

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    res.status(200).json({ message: "Review added/modified successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 9: Delete book review added by that particular user
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { username } = req.user; // assume we have the username from JWT payload

  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    res.status(200).json({ message: "Review deleted successfully" });
  } else {
    res.status(404).json({ message: "Book or review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
