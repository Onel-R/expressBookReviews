const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const getBooks = 
    new Promise((resolve) => {
      setTimeout(() => { resolve(books) }, 10000); // Simulate network delay
    });

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //getBooks.then((booksList) => {
      //  res.send(JSON.stringify(booksList, null, 4));
    //})
    const data = await new Promise((resolve) => {
        //const booksList = Object.values[books];
        resolve(books); // Simulate network delay
      }, 100000).then((booksList) => {
            res.send(JSON.stringify(booksList, null, 4));
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBooks.then((booksList) => {
        res.send(booksList[isbn]);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let filteredBooks = [];
    getBooks.then((booksList) => {
        Object.values(booksList).forEach(value => {
            if(value.author === author) {
                filteredBooks.push(value);
            }
        });
        res.send(filteredBooks);
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let filteredBooks = [];
    getBooks.then((booksList) => {
        Object.values(booksList).forEach(value => {
            if(value.title === title) {
                filteredBooks.push(value);
            }
        });
        res.send(filteredBooks);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
