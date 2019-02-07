import {QuestionsModel} from './model';
import {videoHandler} from './'
import _ from 'lodash'

export class QuestionHandler{
    static async GetAllQuestions(){
        return await QuestionsModel.find({});
    }

    
    static async addQuestion(Title:string,asnwers:[]){
        let q=new QuestionsModel();
        //@ts-ignore
        q.Title=Title;
        asnwers.forEach((v)=>{
            //@ts-ignore
            q.Answers.push({Title:v});
        })
        
        return await q.save();
    }
    static async findAnswersQuestion(answerId:string){
        let Question=await QuestionsModel.findOne({
            'Answers._id':answerId
        })
        return Question;
    }

    static async FindVideos(answerId:string[]){
        try {
            let suggestions=await this.findAnswer(answerId);
            let result:any=[];
            
            for (const video of suggestions) {
                result=_.concat(result,video.videosId);
            }
            result=_.uniqWith(result,_.isEqual);
            // console.log(result);//#1
            
            return {
                cats:await this.findCatigoryies(),
                Suggested:await this.SuggestedVideos(result),
                AllOthers:await this.AttachVideos(result)
            };
        } catch (error) {
            throw error;
        }
    }
    private static async findCatigoryies(){
        let catList=new Set()
        let videos=await videoHandler.FindAll()
        videos.forEach((e)=>{
            //@ts-ignore
            catList.add(e.Description)
        })
        return Array.from(catList);
    }
    private static async SuggestedVideos(videoIds:string[]){
        return this.FormatVideo(await videoHandler.Findallin(videoIds))
    }
    private static async AttachVideos(videoIds:string[]){
        return this.FormatVideo(await videoHandler.FindallExcept(videoIds));
    }
    private static async FormatVideo(videoIds:any){
        // console.log(videoIds);
        // console.log("***************************************************************************************");
        
        let videos=[]
        for(let video of videoIds){
            videos.push({
                //@ts-ignore
                id:video._id,
                //@ts-ignore
                title:video.Title,
                //@ts-ignore
                category:video.Description,
                //@ts-ignore
                thumbnail:process.env.BURL+"/"+video.id+".jpg"
            });
        }
        return videos
    }
    static async findAnswer(answerId:string[]){//test
        try {
            let answers=[];

            for (let id of answerId){
                // console.log(id);
                
                let Question=await this.findAnswersQuestion(id)
                
                //@ts-ignore
                var Answer = await Question.Answers.id(id);
                
                answers.push(Answer);
            }

            return answers;
        } catch (error) {
            console.log(error);
            throw new Error("the Answers Couldn't Found")
        }        

    }
}

