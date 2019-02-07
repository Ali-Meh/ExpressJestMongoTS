import {VideoModel} from './model';
import _ from 'lodash'
import path from 'path'
import {QuestionHandler} from './'
import Run from './libs/Run'
export class videoHandler{

    public static async FindById(videoId:string){
        return await VideoModel.findById(videoId);
    }

    public static async FindAll(){
        return await VideoModel.find({});
    }
    public static async GetVideoAddress(VideoId:string){//test
        let video=await this.FindById(VideoId);
        
        //@ts-ignore
        return video.Path;
    }

    public static async FindallExcept(videoIds:string[]){
        return await VideoModel.where("_id").nin(videoIds);
    }
    public static async Findallin(videoIds:string[]){
        return await VideoModel.where("_id").in(videoIds);

        // let videos:any=[];
        // for (const id of videoIds) {
        //     videos.push(await this.FindById(id));
        // }
        // // console.log(videos);
        
        // return videos;
    }
    static async assignVideo(answerId:string,videoId:string[]){
        let question=await QuestionHandler.findAnswersQuestion(answerId);
        try {
            //@ts-ignore
            const answer = question.Answers.id(answerId);
            let notFoundVideos=[]
            // console.log("*******");
            answer.videosId=[];
            //@ts-ignore
            // await question.save().catch((err)=>{console.log(err);});
            
            for (const videoid of videoId) {
                let video=await this.FindById(videoid);

                if(video&&question){
                    answer.videosId.push(video.id);
                    try {
                        await question.save().catch((err)=>{console.log(err);});

                    } catch (error) {
                        throw error;
                    }
                }else{
                    notFoundVideos.push(videoid);
                }
            }
            console.log(answer.videosId);

            return notFoundVideos;
        } catch (error) {
            throw error;
        }
        
    }

    public static async addVideo(files:[],titles:string|string[],discriptions:string[]){//test

        let Result=[];
                    // console.log("*******");
                    // console.log(question);
        // if(question){ 
            if(!_.isArray(titles)){
                titles=[titles]
            }
            for(let i=0;i<files.length;i++){
                let video=new VideoModel({
                    Title:titles[i],
                    Description:discriptions[i],
                    //@ts-ignore
                    Path:files[i].path
                });

                Result.push({
                    id:video.id,
                    //@ts-ignore
                    Title:video.Title
                })
                //@ts-ignore
                let {stdout,stderr}=await Run(`ffmpeg -i "${path.join(__dirname,'..',video.Path)}" -map 0:v:0 -c copy -f null -`)

                
                let matches= String(stderr).match(/frame=(\s+)(\d+)/gm),frameCount;
                //@ts-ignore
                
                frameCount=matches?Number(matches[0].split("=")[1]):0;
                frameCount=Math.floor(frameCount/2);
                // console.log(frameCount);

                
                //@ts-ignore
                video.thumbPath=`${process.env.thumbleFoder}/${video.id}.jpg`;
                //@ts-ignore
                let Thumbnail=`${path.join(__dirname,'..',video.thumbPath)}`;
                
                //@ts-ignore
                // console.log(video.thumbPath);
                /*
                ./ffmpeg -loglevel panic -y -i "${path.join(__dirname,'..',video.Path)}" -vframes 1 -q:v 0 -vf "select=gte(n\,${frameCount})" "${Thumbnail}"
                */
                //@ts-ignore
                await Run(`ffmpeg -loglevel panic -y -i "${path.join(__dirname,'..',video.Path)}" -vframes 1 -q:v 0 -vf "select=gte(n\\,${frameCount})" "${Thumbnail}"`);
                console.log("thumbs :"+Thumbnail);
                //@ts-ignore
                console.log("video: "+path.join(__dirname,'..',video.Path));
                
                await video.save((err)=>{
                    if(err)
                        console.log(err);
                });
            }

            return Result;
            
        // }
    }
    public static async EditVideo(id:string,title:string,discription:string){//test
        try {
            let video=await VideoModel.findById(id);
            if(video){
                //@ts-ignore
                video.Title=title;
                //@ts-ignore
                video.Description=discription;
                video.save();
                return video;
            }else{
                throw new Error('the Video Id is not Valid');
            }     
        } catch (error) {
            throw error;
        }
    }

}


