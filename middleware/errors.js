function return404 (req, res, next) {
    res.status(404).send("Page not found.");
}

function return500 (error, req, res, next) {
    res.status(500).send("Internal server error.");
}

module.exports = {
    return404,
    return500
}