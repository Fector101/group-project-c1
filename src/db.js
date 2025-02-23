const mongoose = require('mongoose');

let cachedDB;
const uri = process.env.MONGO_URI

if (!uri){
    throw new Error('Please add URI to env vars')
}

async function connectToDatabase() {
    if(cachedDB){
        return cachedDB
    }
    console.log('Creating new DB connection')
    const connection = mongoose.connect( uri, {useNewUrlParser: true} )
    cachedDB = connection
    return cachedDB
}

module.exports = connectToDatabase
