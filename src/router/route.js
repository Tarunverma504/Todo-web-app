const express = require("express");
const router = express.Router();
const bcrypt=require("bcryptjs");
const userData = require("../models/register");
const localStorage=require("localStorage");

const validation=function(req,res,next){     //middleWare
    const user_name= req.body.username;
    userData.findOne({username:user_name}).then(user=>{
        if(user){
         req.user=user;
         next();
        }
        else{
            next();
        }
    })
    
}

router.get("/todo",async(req,res)=>{
    try{
        var id=localStorage.getItem("userid");
        const getData = await userData.findById({_id:id});
        res.render("todo",{todoTasks:getData.tasks});
    }
    catch(e){
        console.log(e);
    }
})

router.get("/",(req,res)=>{                        //login page
    res.render("index.ejs",{warning1:null});
})  


router.get("/signup",(req,res)=>{                   //signup page
    res.render("signup",{warning2:null});
})


router.post("/register",validation,async(req,res)=>{       //store  USER DATA
    try{
        if(req.user){
            res.render('signup',{warning2:"Username is already present"});    
        }
        else{
            const pass=req.body.password
            const cpass=req.body.cpassword
            if(pass==cpass){
                const passwordHash = await bcrypt.hash(pass,10);
                const user = new userData({
                    username:req.body.username,
                    email:req.body.email,
                    password:passwordHash,
                })
                const registered= await user.save();
                res.status(201).render("index",{warning1:"Account Created Successfully"});
            }
            else{
                res.render('signup',{warning2:"Invalid Confirmation Password"})
            }
        }
    }
    catch(e){
        console.log(e);
    }
})

router.post("/login",async(req,res)=>{
    const username=req.body.login_userName;
    userData.findOne({username:username}).then(async(user)=>{
        if(user){
            var id=user._id;
            localStorage.setItem("userid",id); // Store
            const result= await bcrypt.compare(req.body.login_password,user.password);
            if(result==false){
                res.render('index',{warning1:"Incorrect Username or Password"});
            }
            else{
                res.redirect("/todo");  
            }
            
        }
        else{
            res.render('index',{warning1:"Incorrect Username or Password"});    
        }
    })
    
})


router.post("/sendData",async(req,res)=>{
    try{
    
        if(req.body.content.trim().length!=0){
        var id=localStorage.getItem("userid");
        var content=req.body.content.trim();
        await userData.findOneAndUpdate( { _id: id },  { $push: { tasks:content} },{new:true,useFindAndModify:false}); 
        res.redirect("/todo");
        }
        else{
            res.redirect("/todo");
        }
    }
    catch(e){
        console.log("sendData")
    }
})


router.get("/remove/:details",async(req,res)=>{
         var id=localStorage.getItem("userid");
         await userData.findByIdAndUpdate({_id:id}, { $pull: { tasks: req.params.details  } }, { new:true,useFindAndModify:false,safe: true, upsert: true })
        res.redirect("/todo");
})


router.get("/Todo/edit/:index",async(req,res)=>{

    try{
        var id=localStorage.getItem("userid");
        console.log(id);
        const getData = await userData.findById({_id:id});
        var index=req.params.index;
        res.render("todoEdit",{todoTasks:getData.tasks,index:index});
    }
    catch(e){
        console.log(e);
    }   
})

router.post("/Todo/edit/:index",async(req,res)=>{
    try{
        if(req.body.content.trim().length!=0){
        var id=localStorage.getItem("userid");
        var obj={};
        obj["tasks."+req.params.index] = req.body.content;
        console.log(obj);
        console.log(req.body.content.trim().length);
        await userData.findByIdAndUpdate({_id:id},{$set:obj},{ new:true});
        res.redirect("/todo");
        }
        else{
            res.redirect("/todo");
        }
    }
    catch(e){
        console.log(e);
    }
})








router.get("/data/:id",async(req,res)=>{
   var a= await userData.findById({_id:req.params.id});
    console.log(a.tasks[0]);
})

router.post("/update/:id",async(req,res)=>{
    console.log(req.params.id);
    console.log(req.body);

    var task= "tasks."+req.params.id;
    task = JSON.stringify(task);
    var a= await userData.findByIdAndUpdate({_id:req.params.id},{$set: {"tasks.1": "Om"}});
    console.log("done");
})


module.exports = router;
