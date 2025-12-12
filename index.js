//7. import dotenv

 require("dotenv").config() //loads .env file contents into process.env by default

//1. import express

const express = require("express")

// 5. import cors

const cors = require("cors")

//8. import routes
const router = require("./router")

//11.import coonection file
require("./db/connection")

//2. create server

const bookStoreServer = express()

//6. tell server to use the cors

bookStoreServer.use(cors())

//10. parse request //middileware
bookStoreServer.use(express.json())

//9. tell server to use router
bookStoreServer.use(router)

//for opening img in browser  helping for view static files using express.static
bookStoreServer.use("/imageuploads", express.static("./imageuploads"))

//3. create port

const PORT = 4000

//4. tell server to listen 

bookStoreServer.listen(PORT,()=>{
    console.log(`bookstore server started running successfully at port number ${PORT} ,waiting for client request`);
    
})

bookStoreServer.get("/",(req,res)=>{
    res.status(200).send(`Book store server started running successfully and waiting for client request`)
})

// bookStoreServer.post("/",(req,res)=>{
//     res.status(200).send(`POST REQUEST`)
// })