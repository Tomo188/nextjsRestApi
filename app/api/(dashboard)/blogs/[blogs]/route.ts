import { NextResponse } from "next/server";
import connect from "@/lib/modals/db";
import Blog from "@/lib/modals/blog";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import {Types} from "mongoose";

export const GET=async (req: Request,context:{params:any})=>{
    const blogId=context.params.blogs;
    try {
        const {searchParams}=new URL(req.url)
        const userId=searchParams.get('userId')
        const categoryId=searchParams.get('categoryId')
        if(!userId || !Types.ObjectId.isValid(userId)){
          return new NextResponse(JSON.stringify({message:"user not found"}),{status:400})
        }
        if(! categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message:"category not found"}),{status:400})
        }
        if(! blogId || !Types.ObjectId.isValid(blogId)){
            return new NextResponse(JSON.stringify({message:"blog id not found"}),{status:400})
        }
        await connect()
        const user=await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify({message:"user not found"}),{status:404})
        }
        const category=await Category.findById(categoryId)
        if(!category){
            return new NextResponse(JSON.stringify({
                message:"Category not found"
            }),{
                status:404
            })
        }
        const blog=await Blog.findById(blogId)
        if(!blog){
            return new NextResponse(JSON.stringify("blog not found"),{status:400})
        }
        return new NextResponse(JSON.stringify({message:"blog found",blog}),{status:200})
    } catch (error:any) {
        return new NextResponse("error in fetching blog"+error.message,{status:500})
    }
}

export const PATCH=async(req:Request,context:{params:any})=>{
    const blogId=context.params.blogs
    try {
      const {searchParams}=new URL(req.url);
      const userId=searchParams.get('userId');
      const categoryId=searchParams.get('categoryId')
      if(!userId || !Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify({message:"user id is not valid"}),{status:400})
      }
      if(!categoryId || !Types.ObjectId.isValid(categoryId)){
        return new NextResponse(JSON.stringify({message:"category id is not valid"}),{status:400})
      }

      const {title,description}=await req.json()
      if(!Types.ObjectId.isValid(blogId)){
        return new NextResponse(JSON.stringify({message:"invalid blog id"}),{status:400})
      }        
      await connect()
      const blog=await Blog.findByIdAndUpdate(
        blogId,
        {title:title,description:description},
        {new:true}
      )
     
      blog.save()
      return new NextResponse(JSON.stringify({message:"blog updated",blog}),{status:200})
    } catch (error:any) {
        return new NextResponse("error in fetching blog"+error.message,{status:500}) 
    }
}
export const DELETE=async(req:Request,context:{params:any})=>{
    const blogId=context.params.blogs
    try {
        const {searchParams}=new URL(req.url);
        const userId=searchParams.get('userId');
        console.log(userId)
        if(!userId || !Types.ObjectId.isValid(userId)){
          return new NextResponse(JSON.stringify({message:"user id is not valid"}),{status:400})
        }
        if(!blogId || !Types.ObjectId.isValid(blogId)){
          return new NextResponse(JSON.stringify({message:"category id is not valid"}),{status:400})
        }
  
              
        await connect()
        const blog=await Blog.findOne(
        {
          _id:blogId,
          user:userId
        }
      )
        if(!blog){
          return new NextResponse(JSON.stringify({message:"blog is not found"}),{status:404})
        }
        
        await Blog.findByIdAndDelete(blogId)
        return new NextResponse(JSON.stringify({message:"blog deleted"}),{status:200})
    
    } catch (error:any) {
      return new NextResponse("error in fetching blog"+error.message,{status:500}) 
    }
}