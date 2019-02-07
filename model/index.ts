export * from './AdminMHandler';
export * from './DocModelHandler';//done
export * from './PatiModelHandler';
export * from './QuestionModelHandler';
export * from './VideoMHandler';



//interfaces

export interface IDoctor{
    Username:string;
    Password:string;
    Name:string;
    Gender:boolean;
}
export interface IPatient{
    Username?:string;
    Password?:string;
    Name:string;
    Gender:boolean;//true male || false female
}
export interface IAnswers{
    Answers:{Title:string}[]
}

export interface IVisit{
    date?:number,
    SeggestedVideos?:IVideo[]
}

export interface IVideo{
    video:String,
    startDate:Date,
    endDate:Date
}
