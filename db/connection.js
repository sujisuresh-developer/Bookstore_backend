const mongoose = require("mongoose")

const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(res=>{
    console.log("MongoDb Connected Successfully");
    
}).catch(err=>{
    console.log(`MongoDB Connection Failed Due to : ${err}`);
    
})