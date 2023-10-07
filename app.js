const express = require('express')
const apiRoutes = require('./routes/api')
require('dotenv').config()
const app = express()


app.use('/api',apiRoutes)

app.use('/',(req,res)=>{
    res.status(200).json({
        message:'Welcome to my new application'
    })
})

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong'
    const errors = err.cons
    console.log(errors)
    if(errors){
        let output = errors[0].msg
        if(output){
        return res.status(statusCode).json({message: message,output: output});
        }
    }
    res.status(statusCode).json({message: message,statusCode,errors});
})

app.use("*",(req,res)=>{
    res.status('404').json({
        message:'Navigated to the wrong page'
    })
})

app.listen(process.env.PORT||8080,()=>{
    console.log(`listening to http://localhost:${process.env.PORT?process.env.PORT:'8080'}`)
})