const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* Create the router */

const router = express.Router();

/* Get a connection to the db */

const db = require("../database/connection");

/* All routes are relative to where the router is mounted */

router.post("/register", bodyParser.json(), bodyParser.urlencoded({ extended : false}), (req, res) => {

    if (!req.body || !req.body.password || !req.body.username){
        res.status(400)
        res.send("Registration requires both a username and a password.")
    } else {

        let user = req.body.username;
        let password = req.body.password;

        db.query("SELECT * FROM users WHERE user_name = $1", [user])
            .then(result => {

                // Check  for username uniqueness
                if (result.rowCount != 0) {
                    res.status(400).send("An account with that username already exists.");
                } else {
                    bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
                        .then(hash => {
                            db.query("INSERT INTO users (user_name, user_password) VALUES ($1, $2)", [user, hash])
                                .then(result => {
                                    console.log("New user registered.");
                                    res.status(201).send("User registered successfully.");
                                })
                                .catch(err => res.status(500).send("Internal server error."));
                        })                    
                }

            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Internal server error.")
            })

    }

})

router.post("/login", bodyParser.json(), bodyParser.urlencoded({ extended : false}), (req, res) => {
    
    if (!req.body || !req.body.password || !req.body.username){
        res.status(400)
        res.send("Logging in requires both a username and a password.")
    } else {
        
        // Find a matching user
        db.query("SELECT user_name, user_password FROM users WHERE user_name = $1 LIMIT 1;", [req.body.username])
            .then(result => {

                if (result.rowCount != 1){
                    res.status(400).send("No matching user found.")
                } else {
                    // Check for password validity

                    bcrypt.compare(req.body.password, result.rows[0].user_password)
                        .then(result => {
                            if (result) {

                                // Sign and send a JWT
                                let payload = {
                                    username : req.body.username
                                };

                                let token = jwt.sign(payload,
                                                     process.env.JWT_SECRET,
                                                     { expiresIn: parseInt(process.env.JWT_DURATION_SECONDS) });

                                res.status(200).json({ 
                                    success: true,
                                    token : `Bearer ${token}` });
                            } else {
                                res.status(400).json({
                                    success: false,
                                    error: "invalid credentials"
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).send("Internal server error.");
                        })
                }
            })
            .catch(err => {
                res.status(500).send("Internal server error.")
            })

    }
})

router.get("/refresh", (req, res) => {
    res.send("refresh!");
})

router.get("/logout", (req, res) => {
    res.send("logout!");
})

module.exports = router;