const mongoose = require('mongoose');
require('dotenv').config()


// const mongoURI = 'mongodb://localhost:27017/iNotebook';
const dbUri = process.env.DATABASE_URI 

const mongoURI = dbUri;
console.log(mongoURI);

const connectToMongo = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("Database connected!"))
        .catch(err => console.log(err));

}

module.exports = connectToMongo;