import mongoose from 'mongoose';



let video=new mongoose.Schema({
    Title:{type:String,required:true},
    Description:{type:String},
    Catigory:{type:String},
    Path:{type:String,required:true},
    thumbPath:{type:String},
})




export let VideoModel= mongoose.model("video",video);