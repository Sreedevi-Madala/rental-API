module.exports = function (req, res, next) {
    // 401 anauthorized
    // 403 forbidden

    if (!req.user.isAdmin) return res.status(403).send('Not anauthorized')

    next()
}
