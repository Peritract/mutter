const express = require("express");
const bodyParser = require("body-parser");

const verifyToken = require("../middleware/verify-token");

/* Create the router */

const router = express.Router();

/* Get a connection to the db */

const db = require("../database/connection");

/* All routes are relative to where the router is mounted */

router.get("/users", verifyToken, (req, res) => {
    db.query("SELECT user_name FROM users ORDER BY user_name;")
        .then(result => {
            res.status(200).json({
                success : true,
                users : result.rows.map(e => e.user_name)
            });
        })
        .catch(err => res.status(500).send("Internal server error"))
})


module.exports = router;