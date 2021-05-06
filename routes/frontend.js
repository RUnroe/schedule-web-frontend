const path = require('path');
const fileDirectory = path.resolve(__dirname, '.', '../public/html/');

const index = (req, res) => {
    res.sendFile("index.html", {
      root: fileDirectory
    });
  };


const requireAuth = (req, res, next) => {
    if (req.session.user_id) {
        next();
    } else {
        res.redirect("/");
    }
};

// if they're already logged in, redirect them to /app
const requireNotAuth = (req, res, next) => {
    // if (req.session.user_id) {
    //     res.redirect("/app");
    // } else {
    //     next();
    // }
    next();
};

const routes = [
    {
      uri: "/",
      methods: ["get"],
      handler: [requireNotAuth, index]
    },
    
];

module.exports = { routes };