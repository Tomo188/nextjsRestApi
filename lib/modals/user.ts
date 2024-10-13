import { Schema,model,models } from "mongoose";
import { emit } from "process";

const userSchema=new Schema(
{
    username:{required:true,type:"string",unique:true},
    email:{required:true,type:"string",unique:true},
    password:{required:true,type:"string"}
},
{
    timestamps:true
}
)

const User=models.User || model("User",userSchema);
export default User;