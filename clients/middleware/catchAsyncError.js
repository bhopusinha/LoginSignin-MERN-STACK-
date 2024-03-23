const cathAsyncError=(fn)=>async(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch(next);
}

module.exports=cathAsyncError;