import mongoose from 'mongoose';



let Questions=new mongoose.Schema({
    Title:{type:String,required:true},
    Answers:[{
        Title:{type:String,required:true},
        videosId:[{type: mongoose.Schema.Types.ObjectId, ref: 'video'}]
    }]
    
});

let Disease=new mongoose.Schema({
    Title:{type:String,required:true},
    Description:{type:String},
    Questions:[Questions]
})




export let QuestionsModel= mongoose.model("disease",Disease);
