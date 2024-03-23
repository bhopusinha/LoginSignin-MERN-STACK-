const app=require('./app');
const cloudinary=require('cloudinary');


require('./db/dbConnection');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT, () => {
    console.log(`server is listening on PORT : http://localhost:${process.env.PORT}`);
})
