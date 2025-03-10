const expires = require("express");
const router = expires.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { redirectUrl } = require("../middleware");
const { signup, renderSignFrom, login, logout } = require("../Controller/users");

router.get("/signup", (req, res) => {
    res.render('./users/signup.ejs');
})

router.post("/signup", wrapAsync(signup));



/* Login code started here.. */

router.get("/login", renderSignFrom);

/* User ko authenic krege fir login krne dege ye kaam krege passport.authentic middleware */

router.post("/login", redirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),login)


/*Logout Route */

router.get("/logout", logout);

module.exports = router;