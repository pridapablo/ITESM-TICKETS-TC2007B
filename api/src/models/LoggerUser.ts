import {Schema,model} from 'mongoose';

const LoggerUserSchema = new Schema({
    loggedID:{type :Schema.Types.ObjectId, ref:'User'},
    modifiedUserID:{type:Schema.Types.ObjectId, ref:'User', default:null},
    action: String,
    
},{
    timestamps:true
})

export default model("LoggerUser",LoggerUserSchema);