import connect from "@/lib/modals/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
const ObjectId=require("mongoose").Types.ObjectId;
export const GET=async ()=>{
     try {
        await connect()
        const user=await User.find()
       
        return new NextResponse(JSON.stringify(user),{status:200})
     } catch (error:any) {
        return new NextResponse(`error in fetching user ${error.message}`,{status:500})
     }
    
}

export const POST= async (req:Request)=>{
  try {
    const body=await req.json()
    await connect()
    const newUser=new User(body)
    await newUser.save()
    return new NextResponse(JSON.stringify({message:"user is created",user:newUser}),{status:200})
  } catch (error:any) {
    return new NextResponse(`error in createing useer ${error.message}`,{status:500})
  }
}
export const PATCH= async (req:Request)=>{
    try {
        const body=await req.json()
        const  {userId,newUsername}=body
        console.log(userId,newUsername)
        if(!userId || !newUsername){
            return new NextResponse(JSON.stringify({message:"id or new username not found"}),{status:500}) 
        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"invalid use"}),{status:400})
        }
        const updateUser=await User.findOneAndUpdate(
            {_id:new ObjectId(userId)},
            {username:newUsername},
            {new:true}
        )
        if (!updateUser){
            return new NextResponse(JSON.stringify({message:"user not found"}),{status:400})
        }
        return new NextResponse(JSON.stringify({message:"user is updated",user:updateUser}),{status:200})
    } catch (error:any) {
        return new NextResponse(JSON.stringify({message:`user not updated ${error.message}`}),{status:500})
    }
}
export const DELETE=async (Request:Request)=>{
    try {
        const {searchParams}=new URL(Request.url)
        const userId=searchParams.get("userId")
        if(!userId){
            return new NextResponse(JSON.stringify({message:"username or userId not found"}),{status:400})
        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"user id is not found"}),{status:400})
        }
        await connect()
        const deletedUser=await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        )
        if(!deletedUser){
            return new NextResponse(JSON.stringify({message:"user not found in database"}),{status:400})
        }
        return new NextResponse(JSON.stringify({message:"user deleted",user:deletedUser}),{status:200})
    } catch (error:any) {
        return new NextResponse(JSON.stringify({message:`user not delete error: ${error.message}`}),{status:500})
    }
}