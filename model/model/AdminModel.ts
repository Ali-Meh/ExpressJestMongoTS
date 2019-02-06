import mongoose from 'mongoose';




let Admin=new mongoose.Schema({
    Username:{type:String,required:"true"},
    Password:{type:String,required:"true"}
})




export let AdminModel= mongoose.model("Admin",Admin);