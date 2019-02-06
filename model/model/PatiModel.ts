import mongoose from 'mongoose';


let VideoDetail=new mongoose.Schema({
    video:{type: mongoose.Schema.Types.ObjectId, ref: 'video'},
    startDate:{type:Date},
    endDate:{type:Date},
    TimeWatched:[{type:Date,default:Date.now()}]
})

let Visit={
    date:{type:Date,default:Date.now()},
    SeggestedVideos:[VideoDetail]
}

let patient=new mongoose.Schema({
    Username:{type:String},
    Password:{type:String},
    Gender:{type:Boolean,required:true},
    Name:{type:String,required:true},
    Visition:[Visit],
})

patient.methods.IsvideoSuggested=function(videoId:String){
    for (const visitDetail of this.Visition) {
        for (const videoDetail of visitDetail.SeggestedVideos) {
            if(videoId==videoDetail.video){
                return true;
            }
        }
    }
    
    return false;
}






export let PatiModel= mongoose.model("patient",patient);