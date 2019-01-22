// import '../Config/Config';
import '../Config/Config.ts';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path'
// require('../logger.ts')
/**
 * init App
 */

 let app=express();
 app.disable('x-powered-by');

 app.set('superSecret', process.env.secret);

mongoose.connect(process.env.DBUrl||"",{ useNewUrlParser: true }).then(()=>{
    // console.log(v);
    console.log("connected seccesfully");
}).catch((reason)=>{
    console.log(reason);
});

//body parser init
app.use(bodyParser.raw())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(express.static(path.join(__dirname,'../public')));

//Routes
// app.use('/Api',require('./Routes/Api'));
// app.use("/admin",require('./Routes/admin'));



/**
 * restrected Zone
 */
app.get("*",(req,res)=>{
    res.statusCode=404;
    res.send({
        success:false,
        message:"the page you Looking For Not Found"});
    res.end();
})

const server=app.listen(process.env.PORT,()=>{
    // @ts-ignore
    __logger.info(`app started and running on port ${server.address().port} and address ${server.address().address}`)
    // @ts-ignore
    __logger.info(server.address())    
});