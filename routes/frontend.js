const path = require('path');
const fileDirectory = path.resolve(__dirname, '.', '../public/html/');



const requireAuth = (req, res, next) => {
    // if (req.session.user_id) {
    //     next();
    // } else {
    //     res.redirect("/");
    // }
    next();
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


const appPage = (req, res) => {
    res.sendFile("app.html", {
      root: fileDirectory
    });
};
const settings = (req, res) => {
    res.sendFile("settings.html", {
      root: fileDirectory
    });
};
const accountSettings = (req, res) => {
    res.sendFile("accountSettings.html", {
      root: fileDirectory
    });
};
const friends = (req, res) => {
    res.sendFile("friends.html", {
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
    {
        uri: "/app",
        methods: ["get"],
        handler: [requireAuth, appPage]
    },
    {
        uri: "/settings",
        methods: ["get"],
        handler: [requireAuth, settings]
    },
    {
        uri: "/account/settings",
        methods: ["get"],
        handler: [requireAuth, accountSettings]
    },
    {
        uri: "/friends",
        methods: ["get"],
        handler: [requireAuth, friends]
    }
    
];

module.exports = { routes };