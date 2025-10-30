function checkLogin(req, res, next) {
    res.locals.loggedin = req.session.loggedin || false;
    res.locals.firstname = req.session.firstname || "";
    next();
}

module.exports = { checkLogin };
