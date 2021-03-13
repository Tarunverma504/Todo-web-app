const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Admin:Admin@cluster0.zm3l3.mongodb.net/TodoRegistration?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false} )
    .then(()=>{
        console.log("connection is successful");
    })
        .catch((err)=>{
            console.log(err);
        })