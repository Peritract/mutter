// Load environment variables

require('dotenv').config();

// Other imports

const express = require("express");
const path = require("path");

const customLogger = require("./middleware/custom-logger");
const errors = require("./middleware/errors");

const authRouter = require("./routers/auth-router");
const dataRouter = require("./routers/data-router");

/* Create the app itself */

const app = express();

/* set up middleware */

app.use(customLogger);

/* Serve static files */

/* Mount assets from the 'public' dir under the 'static' route.
 * Use the path for extra safety, in case the app is
 * launched from another location than the project root. 
 */

app.use("/static", express.static(path.join(__dirname, "public")));

/* Add on the routers, */

app.use("/auth", authRouter);
app.use("/data", dataRouter);

/* WIP root route */

app.get("/", (req, res) => {
    res.send("Ta-da!")
})

/* Error handling */

app.use(errors.return404);
app.use(errors.return500);

/* Start the Server */

app.listen(process.env.PORT || 3000, '0.0.0.0');
console.log("Server listening on port " + (process.env.PORT || 3000));