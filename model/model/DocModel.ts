import mongoose from 'mongoose';




let Doc=new mongoose.Schema({
    Username:{type:String,required:"true"},
    Password:{type:String,required:"true"},
    Name:{type:String},
    Gender:{type:Boolean,default:true},
    Role:{type:String,required:true},
    ImeiCode:{type:String,required:true},
    Registrycode:{type:String,required:true,unique:true},
    Patient:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'patient'
    }]
})

let patientSignupCode=new mongoose.Schema({
    patientId:{type:String,required:true},
    signupcode:{type:String,required:true,unique:true}
})



export let DoctorModel= mongoose.model("Doctor",Doc);
export let SignCode= mongoose.model("SignCode",patientSignupCode);
