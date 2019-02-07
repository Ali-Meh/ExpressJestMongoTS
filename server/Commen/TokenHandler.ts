import jwt from 'jsonwebtoken';
import {Document} from 'mongoose';
import {Request,Response} from 'express'


export function generateToken(user:Document):string{
    const payload = {
        userId: user._id
    };
    
    var token = jwt.sign(payload,(process.env.secret||"deFualtSecRet")+user._id);
    return token;
}

export function disable(req:Request,res:Response,next:any){
    res.statusCode=404;
    res.json({
        success:false,
        message:"the Route is disabled"
    })
    res.end();
    return;
}


export function TokenMiddelware(req:Request,res:Response,next:any){
    //@ts-ignore
    var token = req.body.token || req.query.token || req.headers['authorization'].split(' ').pop();
    
  // decode token
  if (token) {

      
    // verifies secret and checks exp
    //@ts-ignore
    jwt.verify(token, (process.env.secret||"deFualtSecRet")+jwt.decode(token).userId, function(err:any, decoded:any) {
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' ,auth_error:true});
        } else {
            // if everything is good, save to request for use in other routes
            //@ts-ignore
            req.userId = decoded.userId;     
            next();
        }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'Couldnt authenticat.',
        auth_error:true
    });

  }
}

