const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username }, 'fingerprint_customer', { expiresIn: '1h' });
    req.session.authorization = {
        accessToken: token,
        username: user.username
    };

    return res.json({ message: "Logged in successfully", token });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user; // from the decoded JWT in the session

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;

    return res.json({ message: "Review added/updated successfully" });
});

//delete 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user; // from the decoded JWT in the session

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book has reviews and if the user has a review for this book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "No review found for this user for the specified book" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
