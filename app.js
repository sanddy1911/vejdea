const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose'); 
const path = require('path'); 

const app = express();
//DB Config
const {mongoURI} = require('./config/databse');

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);


//Connect to mongodb
mongoose.connect(mongoURI, { useNewUrlParser: true }).then(() => {
    console.log("Conneced to the database");
}).catch(() => {
    console.log("Unable to connect to the database");
});



//Handlebar Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method Override Middleware
app.use(methodOverride('_method'));

//Express Session Middleware
app.use(session({
    secret: "HeyBiliHeyBilli",
    resave: true,
    saveUninitialized: true,
}));

//Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash Middleware
app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Index Route
app.get('/', (req, res) => {
    const title = "Welcome";
    res.render('index', {
        title
    });
});

//About Route
app.get('/about', (req, res) => {
    res.render("about");
});

//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});