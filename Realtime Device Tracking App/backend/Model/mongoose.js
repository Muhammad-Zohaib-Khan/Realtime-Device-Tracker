import mongoose from "mongoose"

mongoose.connect("mongodb://127.0.0.1:27017/IPT")
const SignSchema=mongoose.Schema(
    {
        name:String,
        email:String,
        password:String
    }
)

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    image: String
});

const User = mongoose.model('user', UserSchema);
const Register= mongoose.model('register',SignSchema)
export default {Register,User};