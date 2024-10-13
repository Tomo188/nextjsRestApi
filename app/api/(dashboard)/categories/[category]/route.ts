import connect from "@/lib/modals/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const PATCH=async (req: Request,context:{params:any})=>{
    const categoryId=context.params.category
    try {
        const body=await req.json()
        const {title}=body
        const  {searchParams}=new URL(req.url)
        const userId=searchParams.get('userId')
        if(!userId || !Types.ObjectId.isValid(userId)){
             return new NextResponse(JSON.stringify({message:"invalid or missing user id"}),{status:400})
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message:"category id is not valid"}),{status:400})
        }
        await connect()
        const user=await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message:"user not found"}),{status:400})
        }
        const category=await Category.findOne({_id:categoryId,user:userId})
        if(!category){
            return new NextResponse(JSON.stringify({message:"Category not found"}),{status:400})
        }
        const updateCateogry=await Category.findByIdAndUpdate(
            categoryId,
            {title},
            {new:true}
        )
        return new NextResponse(JSON.stringify({message:"Successful category update",category:updateCateogry}),{status:200})
    } catch (error:any) {
        return new NextResponse(JSON.stringify(`error in upadating category error: ${error}`),{status:500})
        
    }
}

export const DELETE = async (req: Request,context:{params:any})=>{
    const categoryId=context.params.category
    try {
        const {searchParams}=new URL(req.url)
        const userId=searchParams.get("userId")
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"user not found"}),{status:400})
        }
    
        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message:"Category not found"}),{status:404})
        }
        await connect()
        const user=await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message:"User not found"}),{status:404})
        }
        const category=await Category.findOne({_id:categoryId,user:userId})
        if(!category){
            return new NextResponse(JSON.stringify({message:"category does not exsist"}),{status:400})
        }
        await Category.findByIdAndDelete(categoryId);
        return new NextResponse(JSON.stringify({message:"category is deleted "}),{status:200})
    } catch (error:any) {
        return new NextResponse(JSON.stringify({message:`error deleting category. Error: ${error}`}),{status:500})
    }
}