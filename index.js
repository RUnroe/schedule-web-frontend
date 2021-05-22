const express = require('express');
const path = require('path');
const session = require("express-session");
require('dotenv').config();



const app = express();

app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname + "/public")));

app.use(require('./init-session'));


let routeFiles = ['frontend'];
const routeManager = require('./routes/manager');
routeFiles.forEach((file) => {
        let component = require(`./routes/${file}`);
        if(component.configure) component.configure({app});
        routeManager.apply(app, component);
});


app.listen(3000);