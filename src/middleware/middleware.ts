import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET_KEY = process.env.SECRET_KEY!;

export const userValidation = (req: Request, res: Response, next: NextFunction) => {
  
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Token is required" });
  }

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if(decoded.role !=="user"){
      return res.status(401).json({message:"Unauthorized access"});
    }
    req.body.userId = decoded.userId;

    next();
  });
};


export const adminRouteValidation = (req: Request, res: Response, next: NextFunction) => {
  
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Token is required" });
  }


  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
          if(err.name===TokenExpiredError){
            return res.status(401).json({error:"Token has Expired "});
          }
          return res.status(401).json({ error: "Invalid token" });
    }


    if(decoded.role !=="admin"){
      return res.status(401).json({message:"Unauthorized access"});
    }
    req.body.userId = decoded.userId;
    next();
  });
};

