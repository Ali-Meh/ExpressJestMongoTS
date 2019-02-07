import _ from 'lodash'
import {DoctorModel,SignCode} from './model'
import {IPatient,PatiHandler,videoHandler} from './'
import {Hash} from '../server/Commen'

//todo
/**
 * add imei  auth
 * add new video and question procceses
 */
export class DocHandler{

    public static async FindByUserName(user:String){
        return await DoctorModel.findOne({Username:user});
    }
    public static async FindByID(userId:string){
        
        return await DoctorModel.findById(userId);
    }

    public static async findAll(){
        return DoctorModel.find().populate('Patient').exec()
    }

    static async GetVisitDetail(docId:string,patientId:string,visitId:string,baseUrl:string){
        if(!await this.isDocsPatient(patientId,docId)) throw new Error("you can only access your own patients")
        try {
            return await PatiHandler.GetVisitDetail(patientId,visitId,baseUrl);
        } catch (error) {
            throw error;
        }
    }
    static async AttachVideo(patientId:string,videoId:string,visitId:string,startDate:Date,endDate:Date,docId:string){
        try {
            if(!this.isDocsPatient(patientId,docId)) throw new Error("Sorry but You are not the doctor of this patient");
            return await PatiHandler.AttachVideo(patientId,videoId,visitId,startDate,endDate);
        } catch (error) {
            throw error;
        }
    }
    static async NewVisit(patientId: any){
        return await PatiHandler.NewVisit(patientId);
    }
    static async NewVisitOld(patientId: any, videos:[]){//old
        return await PatiHandler.NewVisitold(patientId,videos);
    }
    static async loggedVideo(patientId:string,videoId:string,visitId:string){
        return await PatiHandler.loggedVideos(patientId,videoId,visitId);
    }

    static async GetVisits(patientId:string,docId:string){
        try {
            
            if(!await this.isDocsPatient(patientId,docId)){throw new Error('sorry but you are not the patients Doc')}
            let visits=await PatiHandler.GetVisits(patientId);
            if(visits){
                return visits;
            }
            throw new Error('no visits founded')
        } catch (error) {
            throw error
        }
    }
    //bug despratioend delete carefully
    /**
     * 
     * @param DocId the patients doc id
     * @param patientId the patients Id
     * @param videoId videos Id
     * @param reminderdate @type Date date of video goto wattched
     * 
     * @returns Errors OR 
     */
    public static async SetVideos(DocId:string,patientId:string,videoId:string,reminderdate:Date){
        if(this.isDocsPatient(patientId,DocId)){
            let patient=await PatiHandler.FindByID(patientId);
            if(patient){
                let video=await videoHandler.FindById(videoId);
                if(video){
                    //@ts-ignore                    
                    if(!patient.IsvideoSuggested(videoId)){
                        //@ts-ignore
                        patient.SeggestedVideos.push({
                            video:video._id,
                            reminderdate
                        });
                    }else{
                        return videoId;
                    }
                    patient.save();
                }else{
                    throw new Error("no Video Find!!!"); //todo catch errors and send off your error
                }
            }else{
                throw new Error("sorry but there is no patient with the provided data contact admin");
            }
        }else{
            throw new Error("sorry but you can only access Your patients");
        }
    }


    public static async getpatients(Docid:string){

        let doc=await DocHandler.FindByID(Docid);
        // console.log(Docid);
        
        if(doc){
            return await doc.populate('Patient').execPopulate();
            // console.log(doc2);
            // return doc2;
        }else{
            throw new Error("Doctor Not Found !!! Please sign up or in");
        }
    }

    public static async AddPatient(patiTemp:IPatient,Docid:string){
        let doc=await DocHandler.FindByID(Docid);

        if(doc){//doc addes new patient doc and patient founded
            let patient=await PatiHandler.CreatePatient(patiTemp);

            //@ts-ignore
            doc.Patient.push(patient._id);

            doc.save((err)=>{
                if (err) throw err;
                //@ts-ignore
                // doc.Patient=patient._id;
            })
            // console.log(patient);
            
            return await (DocHandler.GenerateSignUpCode(patient.id));

        }else{//doc not finded
            throw new Error("Sorry your app isn't signed up Please signup.");
        }
    }

    private static async GenerateSignUpCode(patientId:string){
        let signupcode;
        do{
            signupcode=Math.floor(100000 + Math.random() * 900000);
        }while(!await SignCode.find({signupcode}));
        let patientsigncode=new SignCode({
            patientId,
            signupcode
        })
        patientsigncode.save();
        return patientsigncode;
    }

    public static async getPatient(patientId:string,DocId:string){//todo add visit integeration
        if(await this.isDocsPatient(patientId,DocId)){
            
            let patient=await PatiHandler.FindByID(patientId);
            return _.pick(patient,['Name','Gender','SeggestedVideos'])
        }else{
            return undefined;
        }
    }

    static async isDocsPatient(patientId:string,DocId:string){
        let docpatients=await DocHandler.FindByID(DocId);
        if(docpatients){
            try {            
                //@ts-ignore
                docpatients=docpatients.Patient;
            } catch (error) {
               return false; 
            }
    
            //@ts-ignore
            if(docpatients.indexOf(patientId)>-1){
                
                return true;
            }
        }
        return false;
    }

    public static async CreateDoctor(username:String,password:String,name:String,Gender:boolean,Role:String,Registrycode:string){
        let user=await this.FindByUserName(username);
        if(user){
            throw new Error("User_Existes");
            return;
        }else{
            user =new DoctorModel();
            //@ts-ignore
            user.Username=username;
            //@ts-ignore
            user.Password=await Hash(password);
            //@ts-ignore
            user.Name=name;
            //@ts-ignore
            user.Gender=Gender;
            //@ts-ignore
            user.Role=Role;
            //@ts-ignore
            user.Registrycode=Registrycode;
            try {
                await user.save();            
            } catch (error) {
                throw new Error("some error happend maybe your registry code Existes");
            }            
        }
        return user;
    }
}