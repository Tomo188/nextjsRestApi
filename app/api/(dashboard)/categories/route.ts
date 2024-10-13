import connect from "@/lib/modals/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET=async (req: Request)=>{
    try {
        const {searchParams} =new URL(req.url)
        const userId=searchParams.get('userId');
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"invalid or missing user id"}),{status:400})
        }
        await connect()
        const user=await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message:"user not found"}),{status:400})
        }
        const categories=await Category.find({user:new Types.ObjectId(userId)})
        return new NextResponse(JSON.stringify(categories),{status:200})
        
    } catch (error:any) {
        return new NextResponse(JSON.stringify(`error in fetching categories error: ${error.message}`),{status:500})
    }
}
export const POST=async (req:Request)=>{
    try {
        const {searchParams} =new URL(req.url);
        const userId=searchParams.get('userId');
        const {title}=await req.json()
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"invalid or missing user id"}),{status:400})
        }
        await connect()
        const user=await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message:"user not found"}),{status:400})
        }
        
       const newCategory=new Category({
        title,
        user:new Types.ObjectId(userId)
       })
       await newCategory.save()
       return new NextResponse(JSON.stringify({message:"category created",category:newCategory}),{status:200});
    } catch (error:any) {
        return new NextResponse(JSON.stringify(`error in creating categories error: ${error.message}`),{status:500})
        
    }
}