import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";
import dotenv from "dotenv";
dotenv.config();

export const checkUser = async (req,res,next)=>{
    try{
       const{email} = req.body;
       if(!email){
        return res.json({
            message:"email is required",
            status:false
        })
       }
       const prisma = getPrismaInstance();
       const user = await prisma.user.findUnique({where:{email}});
       if(!user){
        res.json({
            message:"User not Found",
            status:false,
        })
       }
       else{
        res.json({
            message:"User Found",
            status:true,
            data:user
        })
       }
    }
    catch(err){
        next(err);
    }
}

export const onBoardUser=async (req,res,next)=>{
       try{
         const{email,name ,image:profilePicture,about}=req.body;
         if(!email| !name |!profilePicture){
            res.send("email name and profile picture are required");
         }
         const prisma = getPrismaInstance();
        const user= await prisma.user.create({
            data:{email,name,profilePicture,about},
         })
         return res.json({
            message:"success",
            status:true,
            user
         });
       }
       catch(err){
        console.log(err);
        next(err);
    }
}

export const  getAllUsers = async(req,res,next)=>{
    try{
        const prisma = getPrismaInstance();
        const users= await prisma.user.findMany({
            orderBy:{name:"asc"},
            select:{
                id:true,
                email:true,
                name:true,
                profilePicture:true,
                about:true,
            }
        })
        const usersGroupedByInitialLetter={};
          users.forEach((user) => {
             const initialLetter= user.name.charAt(0).toUpperCase();
             if(!usersGroupedByInitialLetter[initialLetter]){
                usersGroupedByInitialLetter[initialLetter]=[];
             }
             usersGroupedByInitialLetter[initialLetter].push(user);
          });
          return res.status(200).send({users:usersGroupedByInitialLetter})
    }
    catch(err){
        next(err);
        console.log(err);
    }

}
export const generateToken = (req,res,next)=>{
     try{
       
       const appId=parseInt(process.env.ZEGO_APP_ID);
       const serverSecret=process.env.ZEGO_SERVER_ID;
       const userId=req.params.userId;
       const effectiveTime=3600;
       const payload="";
       if(appId && serverSecret && userId){
           const token=generateToken04(appId,userId,serverSecret,effectiveTime,payload);
          return  res.status(200).json({
            token
           })
       }
       return res.status(400).send("user id appid server Secret is required")
     }
     catch(err){
        next(err);
     }
}