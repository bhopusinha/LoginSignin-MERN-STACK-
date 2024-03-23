const mongoose=require('mongoose');

mongoose.connect(process.env.DB).then((v)=>{
    console.log(` is connected successfully! : ${v.connection.host}`)
}).catch((e)=>{
    console.log(e);
})

module.exports=mongoose;