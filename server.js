
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "./data.json";
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (d) => fs.writeFileSync(DATA_FILE, JSON.stringify(d,null,2));

app.post("/api/login",(req,res)=>{
  const d=readData();
  res.json({success:req.body.password===d.loginPassword});
});

app.post("/api/admin/login",(req,res)=>{
  const d=readData();
  res.json({success:req.body.password===d.adminPassword});
});

app.post("/api/admin/change-password",(req,res)=>{
  const d=readData();
  d.loginPassword=req.body.newPassword;
  writeData(d);
  res.json({success:true});
});

app.get("/api/emotes",(req,res)=>{
  res.json(readData().emotes);
});

app.post("/api/admin/add-emote",(req,res)=>{
  const d=readData();
  d.emotes.push(req.body);
  writeData(d);
  res.json({success:true});
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log("Running on",PORT));
