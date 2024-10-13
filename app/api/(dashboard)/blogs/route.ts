import { NextResponse } from "next/server";
import connect from "@/lib/modals/db";
import Blog from "@/lib/modals/blog";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import {Types} from "mongoose";

export const GET=async(req: Request)=>{
    try {
        const {searchParams}=new URL(req.url)
        const userId=searchParams.get('userId')
        const categoryId=searchParams.get('categoryId')
        const searchKeywords=searchParams.get('searchKeywords') as string
        const startDate=searchParams.get('startDate')
        const endDate=searchParams.get('endDate')
        const page=parseInt(searchParams.get("page" )|| "1");
        const limit=parseInt(searchParams.get('limit')|| "10")
        console.log(limit)
        if(!userId || !Types.ObjectId.isValid(userId)){
          return new NextResponse(JSON.stringify({message:"user not found"}),{status:400})
        }
        if(! categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify({message:"category not found"}),{status:400})
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
        const filter:any={
            user:new Types.ObjectId(userId),
            category:new Types.ObjectId(categoryId)
        }
          if(searchKeywords){
            filter.$or=[
              {
               title:{$regex:searchKeywords,$options:"i"}
            },
            {
            decription:{$regex:searchKeywords,$options:"i"}
            }
          ]
        }
        if(startDate && endDate){
            filter.createdAt = {
                $gte:new Date(startDate),
                $lte:new Date(endDate)
            }
        }else if(startDate){
            filter.createdAt={
                $gte:new Date(startDate)
            }
        }else if(endDate){
            filter.createdAt={
                $lte:new Date(endDate)
            }
        }
        const skip=(page - 1)*limit
        const blogs=await Blog.find(filter).sort({createdAt:'desc'}).skip(skip).limit(limit)
        return new NextResponse(JSON.stringify({blogs}),{status:200})
    } catch (error:any) {
        return new NextResponse(`error in fetching blogs ${error.message}`,{status:500});
    }
}

export const POST=async(req:Request)=>{
    try {
        const {searchParams} = new URL(req.url)
        const userId=searchParams.get('userId')
        const categoryId=searchParams.get('categoryId')
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"user not found"}),{status:400})
          }
          if(! categoryId || !Types.ObjectId.isValid(categoryId)){
              return new NextResponse(JSON.stringify({message:"category not found"}),{status:400})
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
        const {title,description}=await req.json()
        const blog=new Blog(
            {
                title,
                description,
                user:new Types.ObjectId(userId),
                category:new Types.ObjectId(categoryId)
            }
        )
        await blog.save()
        return new NextResponse(JSON.stringify({message:"successeful created blog",blog}),{status:200})
        
    } catch (error:any) {
        return new NextResponse(`error creating blog ${error.message}`,{status:500})
    }
}

