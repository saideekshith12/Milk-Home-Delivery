import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verification_token:{
        type: String,
        required: true
    },
    token_expiry:{
        type: Date,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    forget_password_token: {
        type: String,
    },
    forget_password_token_expiry: {
        type: Date,
    }
},
{
    timestamps: true,
}
);

UserSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 12);
    }
})

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;