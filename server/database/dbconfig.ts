const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/oxy_book?directConnection=true&tls=false&readPreference=primary";
const mongoURI="mongodb+srv://somu:sg334s22@cluster0.mvf57zm.mongodb.net/omegal?retryWrites=true&w=majority"
const connectToMongoose=()=>{
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoURI);
}

export default connectToMongoose;


