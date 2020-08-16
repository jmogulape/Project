const mongoose = require('mongoose');
const config = require('config');
const db = config.get("mongoURI");

const connectDB = async () => {
    try{
        await mongoose.connect(db, { 
            useNewUrlParser: true,
            //DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.because of this error ,we ll add below
            useCreateIndex: true,
            //To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor
            useUnifiedTopology: true 
        });
        console.log('MongoDB connected');
    } catch(err){
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;