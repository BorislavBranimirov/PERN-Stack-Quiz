const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// .env
require('dotenv').config();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// morgan
app.use(morgan('tiny'));

// helmet
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: { directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'https://res.cloudinary.com', 'data:', 'blob:'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
    }}
}));

// routing
const quizRouter = require('./routes/quizRouter');
const mediaRouter = require('./routes/mediaRouter');
app.use('/api/quiz', quizRouter);
app.use('/api/media', mediaRouter);

// serving react app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});