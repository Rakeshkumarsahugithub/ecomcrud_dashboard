import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;


function myGreeting(morning,afternoon){
    morning();
    afternoon();
}
function morning(){
    console.log("good morning");
}
function afternoon(){
    console.log("good afternoon");
    (function(){
        console.log("good evening");
    })();
}
myGreeting(morning,afternoon);