const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
require("dotenv").config();

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const csurfProtection = csurf();

const store = new MongoDbStore({
    uri: process.env.DB_URI,
    collection: 'blog',
    expires: 1000 * 60 * 60 * 3,
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false);
    }
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.jwt_secret, saveUninitialized: false, resave: false, store: store}))
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use(authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.statusCode).json({ message: error.message });
})

mongoose.connect(process.env.DB_URI);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected');
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', socket => console.log('Client Connected'))
});

connection.on('disconnected', () => {
    console.log('Database connection disconnected');
});