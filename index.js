const express = require('express');
const path = require('path');
const session = require("express-session");


const app = express();

app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname + "/public")));

// app.use(
//     session({
//       secret: require('./secrets').session.secret
//           , name: 'bifrost.session'
//       , resave: false
//       , saveUninitialized: false
//           , cookie: {
//               httpOnly: true
//               , secure: false // only run this behind a secure proxy i guess
//               , sameSite: true
//               , maxAge: 1000 * 60 * 60 * 24 * process.env.SESSION_LIFETIME_DAYS // ms; this is 90 days
//           }
//           , store: new CassandraStore({
//               table: require('./secrets').session.store_table
//               , client: db.db
//           })
//     })
//   );

let routeFiles = ['frontend'];
const routeManager = require('./routes/manager');
routeFiles.forEach((file) => {
        let component = require(`./routes/${file}`);
        if(component.configure) component.configure({app});
        routeManager.apply(app, component);
});


app.listen(3000);