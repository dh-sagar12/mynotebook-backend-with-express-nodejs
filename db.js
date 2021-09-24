const mongoose = require('mongoose');

// const mongoURI = 'mongodb://localhost:27017/iNotebook';

const mongoURI = 'mongodb+srv://admin:admin@inotebook.qj6gn.mongodb.net/inotebook?retryWrites=true&w=majority';

const connectToMongo = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("Database connected!"))
        .catch(err => console.log(err));

}

module.exports = connectToMongo;