const path = require('path');
const fileDirectory = path.resolve(__dirname, '.', '../public/html/');



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


const index = (req, res) => {
    res.sendFile("index.html", {
      root: fileDirectory
    });
};
const signup = (req, res) => {
    res.sendFile("signup.html", {
      root: fileDirectory
    });
};
const login = (req, res) => {
    res.sendFile("login.html", {
      root: fileDirectory
    });
};


const routes = [
    {
      uri: "/",
      methods: ["get"],
      handler: [requireNotAuth, index]
    },
    {
        uri: "/signup",
        methods: ["get"],
        handler: [requireNotAuth, signup]
    },
    {
        uri: "/login",
        methods: ["get"],
        handler: [requireNotAuth, login]
    },
    
];

module.exports = { routes };