const express=require("express");
const mongoose=require("mongoose");

const bodyparser=require("body-parser");
const dotenv=require("dotenv");

const app=express();
dotenv.config();

const port=process.env.PORT ||3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.e0sat.mongodb.net/RegistrationformDB`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
//Registration schema with Mongodb
const registrationSchenma=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});
//module for registartion schema
const Registration =mongoose.model("Registration",registrationSchenma);
app.use(bodyparser.urlencoded({extends:true}));
app.use(bodyparser.json());

app.get("/",(req,res)=>{
 res.sendFile(__dirname +"/pages/index.html");
})

app.post("/register",async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        const existingUser= await Registration.findOne({email:email});
        if(!existingUser){
            
            const RegistrationData=new Registration({
                name:name,
                email:email,
                password:password
                });
               await RegistrationData.save();
               res.redirect("/success")
            }
            else{
                alert("already user Exists");
                res.redirect("/error");
            }
               

    }catch(error){
        console.log(error);
        res.redirect("/error")
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname +"/pages/success.html");
    })
    
    app.get("/error",(req,res)=>{
        res.sendFile(__dirname +"/pages/error.html");
        })



app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
})