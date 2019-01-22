
let env = process.env.NODE_ENV || 'development';
import logger from '../logger';


//@ts-ignore
global.__logger = logger;



if (env === 'development' ||  env === 'test' ) {
    console.log(`Firing app up in ${env} mode !!!`);
    
    let config = require('./Config.json');
    let envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
    });
}

import mongoose from 'mongoose';
if(env==='test'){
    //@ts-ignore
    mongoose.connect(process.env.DBUrl,(err)=>{
        if(!err){
            console.log("successFully connected to DB");
        }else{
            console.log(err.message);
        }
    })
}