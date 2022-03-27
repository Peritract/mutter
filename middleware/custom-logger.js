function customLogger(req, res, next){
    /*Just logs the method, route, and any query params */
    console.log(req.method, req.originalUrl);
    next();
  }


module.exports = customLogger;