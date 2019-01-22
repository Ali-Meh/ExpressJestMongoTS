import express from 'express';
import _ from 'lodash'

// import cors from 'cors';
// route.use(cors());

let route=express.Router();
/**
 * FULLY RESTRECTED by Sessions
 */
// route.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     if ('OPTIONS' == req.method) {
//        res.sendStatus(200);
//      }
//      else {
//        next();
// }});


route.get("*",(req,res)=>{
    res.send("admin section");
});
module.exports=route;