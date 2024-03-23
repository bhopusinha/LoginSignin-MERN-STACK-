const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path : '.env'});
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const uploadeFile=require('express-fileupload');
const path=require('path');


app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({extended:false,limit:'50mb'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(uploadeFile());

const error=require('./middleware/error');

// Router 
const registerRouter=require('./routes/userRouter');

app.use('/api/v1',registerRouter);
app.use(error);

app.use(express.static(path.join(__dirname,'/build')));

app.get('*',function (req,res){
    res.sendFile(path.join(__dirname,'/build/index.html'));
})

module.exports=app;