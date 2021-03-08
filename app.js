const express= require('express');
const app = express();
const path= require("path");
const port = process.env.PORT || 3000;
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Routes = require("./src/router/route");
require("./src/db/conn");

const static_parth=path.join(__dirname, "/public");
const template_parth=path.join(__dirname, "/templates/views");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_parth));
app.use(Routes);
app.set("view engine", "ejs"); 
app.set("views",template_parth);



app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})