const User = require("../model/user");

module.exports.renderSignFrom =  (req, res) => {
    res.render('./users/login.ejs');
}

module.exports.signup = async(req , res, next) => { // ✅ next added
    try {
        let { username , email , password } = req.body;
        let newUser = new User({ username , email });
        const registerUser = await User.register(newUser , password);
        console.log(registerUser);

        /* After signup user automatically login */
        req.login(registerUser , (err) => {
            if(err){
                return next(err); // ✅ return added
            }
            req.flash("success" , "Welcome to the Wanderlust");
            return res.redirect("/listing"); // ✅ return added
        });

    } catch(e) {
        req.flash("error" , e.message);
        return res.redirect("/signup"); // ✅ return added
    }
}

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to the Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    return res.redirect(res.locals.redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logout successfully!");
        return res.redirect("/listing");
    })
}