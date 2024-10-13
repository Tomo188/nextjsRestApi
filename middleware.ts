import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewears/api/authMiddlewear";
import { json } from "stream/consumers";
import { loggingMiddleware } from "./middlewears/api/loggingMiddlewear";

export const config={
    matcher:"/api/:path*"
}
export default function middleware(req: Request){

    if( req.url.includes("/api/blogs")){
        const result=loggingMiddleware(req)
        console.log(result.response)
    }
    const result=authMiddleware(req)
    if(!result)
    {
      return  new NextResponse(JSON.stringify("auth not successed"),{status:401}) 
    }
    return NextResponse.next()
}