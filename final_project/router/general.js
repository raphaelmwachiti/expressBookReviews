const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

// Base URL for your API
const api = axios.create({
  baseURL: 'https://raphaelmwach-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai'
});


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books));

});

// Get book details based on ISBN 
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
const book = books[isbn];

if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
        let bookValues = Object.values(books);
    let filteredBooks = bookValues.filter(book => book.author === req.params.author);

    return res.json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
    let bookArray = Object.values(books);
    let matchingBooks = bookArray.filter(book => book.title.toLowerCase() === title.toLowerCase());

    if(matchingBooks.length) {
        res.status(200).json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found with the given title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      return res.json({reviews: book.reviews});
  } else {
      return res.status(404).json({message: "Book not found"});
  }
}); 

// Task 10: Get the list of books available in the shop
const getBooks = async () => {
    try {
      const response = await api.get('/');
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  
  // Task 11: Get book details based on ISBN
  const getBookByIsbn = async (isbn) => {
    try {
      const response = await api.get(`/isbn/${isbn}`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching book with ISBN ${isbn}:`, error);
    }
  };
  
  // Task 12: Get book details based on Author
  const getBooksByAuthor = async (author) => {
    try {
      const response = await api.get(`/author/${author}`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching books by author ${author}:`, error);
    }
  };
  
  // Task 13: Get book details based on Title
  const getBooksByTitle = async (title) => {
    try {
      const response = await api.get(`/title/${title}`);
      console.log(response.data);
    } catch (error) {
      console.error(`Error fetching books with title ${title}:`, error);
    }
  };

module.exports.general = public_users;
