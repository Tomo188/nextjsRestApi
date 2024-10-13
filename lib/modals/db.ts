import mongoose from "mongoose"

const MONGOSE_BD_URL=process.env.MONGO_DB_URL

const connect = async ()=>{
    const connectionState=mongoose.connection.readyState
    if(connectionState===1){
        console.log("connected")
        return 
    }
    if(connectionState==2){
        console.log("connecting")
        return 
    }
    try{
        mongoose.connect(MONGOSE_BD_URL!,
            {
                dbName:"Wepes",
                bufferCommands:true
            }
        )
    }
    catch(err:any){
        console.error(err)
        throw new Error(err)
    }
}
export default connect