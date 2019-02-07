import {PatiModel,SignCode} from './model'
import {IPatient,videoHandler,IVisit, IVideo} from './'
import {Hash} from '../server/Commen'
import _ from 'lodash'
import moment from 'moment'

//fix up
export class PatiHandler{

    public static async FindByUserName(user:String){
        return await PatiModel.findOne({Username:user});
    }
    public static async FindByID(userId:string){
        let v= PatiModel.findById(userId)//.catch(((err)=>{}))

        v.catch((err)=>{//fixme //bug unhandeldable error with non parseable id
            // throw new Error("User_Not_Existes");
        })
        return  await v;
    }

    static async GetVisitDetail(patientId:string,visitId:string,baseUrl:string){
        try {
            let patient=await this.FindByID(patientId);
            if(patient){
                patient=await patient.populate('Visition.SeggestedVideos.video').execPopulate();
                //@ts-ignore  
                let visitDetail=patient.Visition.id(visitId);
                // console.log(visitDetail);
                let thisVisit=_.pick(visitDetail,['id','date'])
                
                if(thisVisit){
                    //@ts-ignore
                    thisVisit.sugees=[];  
                    //@ts-ignore
                visitDetail.SeggestedVideos.forEach(element => {
                    const v=element.video;
                    if(v){
                        // console.log(v);
                        
                        //@ts-ignore
                        thisVisit.sugees.push({
                            timeWatched:element.TimeWatched,
                            video:{
                                id:v._id,
                                Title:v.Title,
                                Description:v.Description,
                                thumbPath:baseUrl+"/"+v.id+".jpg",
                                Path:baseUrl
                            },
                            startDate:element.startDate,
                            endDate:element.endDate
                        })
                    }
                });


                    return thisVisit;
                } 
                throw new Error('no visit detail avialible')
            }else{
                throw new Error("Could not Found the Patient!!!");
            }
        } catch (error) {
            throw error;
        }
    }


    static async GetVisits(patientId:string){
        try{
            let patient=await this.FindByID(patientId);
            if(patient){
                //@ts-ignore
                return patient.Visition;
            }
            throw new Error();
        }catch(err){
            //@ts-ignore
            throw new Error("no patient Founded with Provided Id");
        }

    }
    static async NewVisit(patientId:string){
        try {
            let patient=await this.FindByID(patientId);
            let Visit:IVisit={date:Date.now(),SeggestedVideos:new Array<IVideo>()};
            if(patient){
                //@ts-ignore
                patient.Visition.push(Visit);
                patient.save();
                //@ts-ignore
                return patient.Visition[patient.Visition.length-1]._id;

            }else{
                throw new Error("no patient found with specified Id");
            }
            
        } catch (error) {
            throw error;            
        }
    }

    static async AttachVideo(patientId:string,videoId:string,visitId:string,startDate:Date,endDate:Date){//test
        try {
            let patient=await this.FindByID(patientId);
            if(patient){
                let video=await videoHandler.FindById(videoId);
                if(video){
                    //@ts-ignore
                    let visitDetail=patient.Visition.id(visitId);
                    if(visitDetail){
                        visitDetail.SeggestedVideos.push({
                            video:video.id,
                            startDate:startDate,
                            endDate:endDate
                        });
                        try {
                            patient.save();
                            return visitDetail.SeggestedVideos[visitDetail.SeggestedVideos.length-1];
                        } catch (error) {
                            throw error;
                        }
                    }else{
                        throw new Error("the visit Not Found");
                    }
                }else{
                    throw new Error("the Video Doesn't Exist");
                }
            }else{
                throw new Error("no Patient Found With specified Id");
            }
        } catch (error) {
            throw error;
        }
    }

    static async NewVisitold(patientId: any, videos:any[]){//old
        try {
            let patient=await this.FindByID(patientId);
            let Visit:IVisit={date:Date.now(),SeggestedVideos:new Array<IVideo>()};

            if(patient){
                for(let v of videos){
                    try {
                        let video=await videoHandler.FindById(v.videoId);
                        if(video){
                            //@ts-ignore
                            Visit.SeggestedVideos.push({
                                video:video.id,
                                startDate:v.start,
                                endDate:v.end
                            });
                        }
                    } catch (error) {
                        throw error;
                    }
                }
                
                //@ts-ignore
                if(!Visit.SeggestedVideos.length)  throw new Error("no videos added somthing went really wrong");
                //@ts-ignore
                patient.Visition.push(Visit);

                patient.save();

                return patient;
            }else{
                throw new Error("no patient found with specified Id")
            }
        } catch (error) {
            throw error;
        }

    }
    public static async loggedVideos(patientId:string,videoId:string,visitId:string){
        let patient=await this.FindByID(patientId);
        if(patient){
            // patient.populate('Visition.SeggestedVideos.video')
            if(visitId===undefined){
                let logsFounded=[];
                //@ts-ignore
                for (let visitition of patient.Visition) {
                    //@ts-ignore
                    for (const video of visitition.SeggestedVideos) {
                        
                        if(video.video==videoId){
                            logsFounded.push(...video.TimeWatched);
                            break;
                        }
                    }
                }
                return logsFounded;            
            }else{
                //@ts-ignore
                for (let visitition of patient.Visition) {
                    if(visitition.id==visitId){
                        //@ts-ignore
                        for (const video of visitition.SeggestedVideos) {
                            if(video.video==videoId){
                                return video.TimeWatched;
                            }
                        }
                    }
                }
                throw new Error('Visit Not Found');
            }  
        }else{
            throw new Error('Sorry But Couldn\'t Find You please Signup or Login');
        }
    
    }
    /**
     * 
     * @param patientId the Id of th patient 
     * @param videoId the videoId Hasbeen Watched
     * @param date the date Video Watched
     * 
     * @returns success or failer of the 
     */
    public static async logVideo(patientId:string,visitId:string,videoId:string,date:Date){
        let patient=await this.FindByID(patientId);
        if(patient){
            // patient.populate('Visition.SeggestedVideos.video')
            let videoFinded=false;
            // console.log(videoId);
            //@ts-ignore
            let visit=patient.Visition.id(visitId);
            
            //@ts-ignore
                //@ts-ignore
                for (const video of visit.SeggestedVideos) {
                    
                    if(video.video==videoId){
                        
                        video.TimeWatched.push(date);
                        videoFinded=true;
                    }
                }

            if(videoFinded){
                patient.save();
            }else{
                throw new Error('Video Hasn\'t been assigned to you');
            }
        }else{
            throw new Error('Sorry But Couldn\'t Find You please Signup or Login');
        }
        return date;
    }
    public static async GetVideos(patientId:string,visitId:string,hostName:string){
        try {
            let patient =await this.FindByID(patientId);
            
            if(patient){
                let patwithvid=await patient.populate('Visition.SeggestedVideos.video').execPopulate();
                let data=[];
                //@ts-ignore
                // console.log(patwithvid.Visition);
                
                //@ts-ignore
                let visit=patwithvid.Visition.id(visitId);
                console.log(visit.SeggestedVideos.length);
                if(visit.SeggestedVideos.length<1){
                    throw new Error('no Video suggested in this Visit');
                }
                
                for (const video of visit.SeggestedVideos) {

                    try {
                        const start=new Date(video.startDate).setHours(0,0,0,0);
                        const now=Date.now()
                        const end=new Date(video.endDate).setHours(24,0,0,0);
                        
                               
                        let sug={
                            videoId:video.video.id,
                            Title:video.video.Title,
                            Description:video.video.Description,
                            thumbPath:hostName+"/"+video.video.id+".jpg",
                            reminderDate:{
                                start:moment(start).format('YYYY/DD/MM'),
                                end:moment(end).format('YYYY/DD/MM')
                            }
                        }
                        const timeToVideo=now - start;
                        const timeFromVideo=end-now;
                        
                        // console.log(moment('2016-10-01T09:45:00.000UTC'));
                        // console.log(moment(start).utcOffset());
                        
                        


                        if(timeToVideo>=0&&timeFromVideo>=0){
                            //@ts-ignore
                            sug.videoLink=hostName+"/api/patient/getVideo"+video.video.id;
                        }



                        data.push(sug);
                    } catch (error) { }

                }

                return {success:true,videos:data};
                
            }else{
                console.log(1);

                throw new Error('Couldn\'t auth You Sorry!!!');
                
            }
        } catch (error) {
            console.log(error);

            throw error;//bug if the visit id ain't right the auth error will pop up
            
        }
    }

    public static async FindBySignCode(userCode:string){
        let patientid=await SignCode.findOne({signupcode:userCode});
        if(patientid){
            //@ts-ignore
            return patientid.patientId;
        }else{
            throw new Error("Oops!!! lookes your code Expired please contact your doc")
        }

    }
    public static async SignUpPatient(Username:string,Password:string,id:string){
        if(await PatiHandler.FindByUserName(Username)){
            throw new Error("the username exist please pick other");
            return;
        }
        try {
            let patient=await PatiHandler.FindByID(id);
            if(patient){

                //@ts-ignore
                if(patient.Username){
                    
                    throw new Error("User_Existes");
                    return;
                }else{
                    //@ts-ignore
                    patient.Username=Username;
                    //@ts-ignore
                    patient.Password=await Hash(Password);
                    await patient.save();
                    await SignCode.findOneAndDelete({patientId:id});
                    return patient;
                }
            } 
        }catch (error) {
            throw new Error("User_Not_Existes");
        }
               
    }


    public static async CreatePatient(Patient:IPatient){
        let user =new PatiModel({
            Name:Patient.Name,
            Gender:Patient.Gender
        });
            user.save((err)=>{if(err) throw err});
        return user;
    }
}