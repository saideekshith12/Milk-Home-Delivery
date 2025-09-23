import mongoose from "mongoose";

const RiderRegistration = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        date:{
            type: Date,
            required: true,
            default: ()=> new Date().toISOString().split("T")[0]
        },
        day:{
            type : String,
            required : true,
            default : ()=> new Date().toLocaleDateString("en-US", { weekday: "long" })
        }        

    });
    
    const Rider = mongoose.models.Rider || mongoose.model("Rider", RiderRegistration);
    
    export default Rider;