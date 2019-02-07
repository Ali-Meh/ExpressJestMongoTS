import { AdminModel, VideoModel } from './model';
import { DocHandler } from './';
import _ from 'lodash'
import { videoHandler } from './VideoMHandler';
import { Hash } from '../server/Commen';



export class AdminHandler {
    /**
     * 
     * @param username the user name of the admin
     */
    public static async FindByUsername(username: string) {
        return await AdminModel.findOne({ Username: username });
    }

    public static async FindById(userId:string){
        return await AdminModel.findById(userId);
    }

    /**
     * 
     * @param username the username of admin
     * @param password the password of the admin
     * 
     * @throws Error if the admins username exists or error on adding the admin
     */
    public static async AddAdmin(username:string,password:string) {
        let admin=await AdminHandler.FindByUsername(username)
        if (admin) {
            throw new Error("User_Existes");
        }

        admin = new AdminModel();
        //@ts-ignore
        admin.Username = username;
        //@ts-ignore
        admin.Password = await Hash(password);

        try {
            await admin.save();            
        } catch (error) {
            throw new Error("some error happend maybe your registry code Existes");
        }   

        return admin;

    }

    public static async deleteVideo(videoId:string){
        try {
            return await VideoModel.findByIdAndDelete(videoId);
        } catch (error) {
            throw error;
        }
    }
    public static async EditVideo(videoId:string,Title:string,Description:string){
        try {
            return await videoHandler.EditVideo(videoId,Title,Description);
        } catch (error) {
            throw error;
        }
    }

    public static async GetDocs() {
        let docs = await DocHandler.findAll();
        let Result = [];
        for (const doc of docs) {
            let per = new Object();
            //@ts-ignore
            per.Name = doc.Name;
            //@ts-ignore
            per.Gender = doc.Gender;
            //@ts-ignore
            per.Role = doc.Role;
            //@ts-ignore
            per.regestryCode = doc.Registrycode;
            //@ts-ignore
            per.patients = new Array();
            //@ts-ignore
            for (const Patient of doc.Patient) {
                //@ts-ignore
                per.patients.push({
                    Name: Patient.Name,
                    Gender: Patient.Gender
                })
            }
            Result.push(per);
        }
        return Result;
    }


    static async GetVideos(hostname: string) {
        let videos = await videoHandler.FindAll();
        if (videos) {
            //@ts-ignore
            return videos.map(({ _id, Title, Description }) => ({
                id: _id,
                Title,
                Description,
                thumbnail: hostname + "/" + _id+".jpg"
            }));
        } else {
            throw new Error("couldn't fetch Any Videos");
        }
    }
}