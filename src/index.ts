import  express  from "express";
import { Request, Response, NextFunction,Application,ErrorRequestHandler } from "express";
import { Server } from "http";
import createHttpError from "http-errors";
import { config } from "dotenv";
import connectDB from "../src/dbconnection";
import route from "../src/routes/routes";
import path from "path";
import cors from "cors"; 

const app:Application = express();
   
app.use(express.json());
config();

// Serve static files from the "uploads" directory
app.use(express.static('public'));
// const PORT:number= process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000',  // Allow only your frontend application
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use("/api", route);

// Error handling middleware
app.use((req:Request,res:Response,next:NextFunction)=>{
    next(new createHttpError.NotFound())
    })
    
    const errorHandler:ErrorRequestHandler=(err,req,res,next)=>{
       res.status(err.status||500)
       res.send({
        status:err.status||500,
        message:err.message
       })
    }
    app.use(errorHandler)

    const PORT:Number=Number(process.env.PORT)|| 3000
    // const server:Server = app.listen(PORT,()=>console.log(`server is listening on ${PORT}`));
    connectDB().then(() => {
    const server:Server=app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
// export default app;

// http://localhost:5500/images//image_1714416293360.jpg