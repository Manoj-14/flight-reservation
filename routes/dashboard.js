module.exports = {
  userDash: (req, res) => {
    var session = req.session;
    console.log(req.session);
    if (session.user) {
      // res.json(session.user);
      res.render("userdashboard.ejs", {
        title: "User Dashboard",
        main: false,
        adminDash: false,
        userDash: true,
        name: session.user,
      });
    } else {
      res.redirect("/login");
    }
  },
  adminDash: (req, res) => {
    var session = req.session;
    console.log(req.session);
    if (session.user) {
      // res.json(session.user);
      res.render("adminDashboard.ejs", {
        title: "Admin Dashboard",
        main: false,
        adminDash: true,
        userDash: false,
        name: session.user,
      });
    } else {
      res.redirect("/login");
    }
  },
};
