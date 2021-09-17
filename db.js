const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/iNotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';

const connectToMongo = async ()=>{
    await mongoose.connect(mongoURI, (err, res)=>{
        try {
            console.log("Connected to Mongo Successfull!!");
            
        } catch (err) {
            console.log(err);
        }

    })
}



module.exports= connectToMongo;