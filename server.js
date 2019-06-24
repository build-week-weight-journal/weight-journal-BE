const express = require("express");
const server = express();
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile').development;

const db = knex(knexConfig);

server.use(helmet());
server.use(express.json());

// sanity check route
server.get("/", (req, res) => {
  res.status(200).json({ hello: "World!" });
});

module.exports = server; 

/*

/signin --> POST = success/fail     // any time we're sending a password we don't really want to send it as a query string
                                       do we? We want to send it inside of the body ideally over HTTPS so that it's hidden from man-in-the-middle
                                       attacks and it's secure

/register --> POST = user 

/profile/:userid --> GET = user    // We want in the homescreen to have an ability to access the profile of the user.
                                      So perhaps we'll have a profile with an optional parameter of 'userId' so that each user has their own homescreen.
                                      We just want to get the user information and this will return us the user

/profile/:userid --> PUT = user // Update user's information

/myjournal/:userid --> GET  = journal // Show journal for the user

/myjournal/:userid --> POST = journal // Post a new journal 

/myjournal/:userid --> PUT  = journal // Update journal 

/myjournal/:userid --> DELETE  = journal // DELETE journal 

*/