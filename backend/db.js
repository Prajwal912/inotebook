const mongoose = require('mongoose');

// const mongoURI = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const mongoURI = "mongodb://localhost:27017/iNotebook";

const connectToMongo = () => {
    mongoose.connect(mongoURI).then(res => {
        console.log("success!")
    }).catch(err => {
        console.log(err)
    })
}

module.exports = connectToMongo;