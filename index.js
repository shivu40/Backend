const express = require('express');
const mongoose = require('mongoose');
const studentRoute=require('./routes/students');
const url='mongodb://127.0.0.1:27017/Student-db'
const app=express()
mongoose.connect(url,{useNewUrlParser:true})

const con=mongoose.connection       

con.on('open',function(){               
        console.log('connected')    
})

app.use(express.json())                 //Adding the middleware so that it can parse json data.




app.use('/',studentRoute)               //adding the middleware here and sending all the requests to studentRoute


app.listen(9000,function(){             //Making the server listen at port no: 9000
    console.log('server is listening')
})