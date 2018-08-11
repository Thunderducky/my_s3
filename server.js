const express = require("express");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT = process.env.PORT;

const BUCKET_NAME = 'es-test-bucket-8156';
const IAM_USER_KEY = process.env.AWS_ACCESS_KEY_ID;
const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

const AWS = require("aws-sdk");

app.use(fileupload());
app.use(express.static("public"));

function uploadToS3(file){
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });
  s3bucket.createBucket(function(){
    var params = {
      Bucket: BUCKET_NAME,
      Key: file.name,
      Body: file.data
    };
    s3bucket.upload(params, function(err, data){
      if(err){
        console.log('error in callback');
        console.log(err);
      }
      console.log('success');
      console.log(data);
    })
  })
}

app.post("/upload", function(req, res){
  uploadToS3(req.files.file);
  res.send("!")
});

app.listen(3000, function(){
  console.log("listening on port 3000");
})
