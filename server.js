const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const flash = require('connect-flash'); // to display flash messages
const passport = require('passport');
const socketIO = require('socket.io');
const { Users } = require('./helpers/UsersClass');
const { Global } = require('./helpers/Global');

const container = require('./container');

container.resolve(function(users, _, admin, home, group, results, privatechat, profile, interests) {

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/assemble', { useNewUrlParser: true, useUnifiedTopology: true });

    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app); // to use ne need to use the http createserver
        const io = socketIO(server);
        server.listen(4000, function() {
            console.log('Listening on port 4000');
        });
        ConfigureExpress(app);

        require('./socket/groupchat')(io, Users);
        require('./socket/friend')(io);
        require('./socket/globalroom')(io, Global, _);
        require('./socket/privatemessage')(io);

        // Setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        results.SetRouting(router);
        privatechat.SetRouting(router);
        profile.SetRouting(router);
        interests.SetRouting(router);
    
        app.use(router);
    }


    function ConfigureExpress(app) {
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');

        // here we will add the configurations
        app.use(express.static('public')); // use all static files in the public folder
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(validator());
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveUninitialized: true,
            store: MongoStore.create({ mongoUrl: 'mongodb://localhost/assemble' })
        }));
        app.use(flash()); 

        app.use(passport.initialize());
        app.use(passport.session());


        app.locals._ = _; // global variable
    }
});


