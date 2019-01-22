function GenResponse(payload:IResponse,res:any){
    console.log(payload);
    
    return res.json(payload);
}


export interface IResponse{
    token?:string
    message?:string
    data?:string
    success?:boolean
}