
const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_FILE = "./server/admin.json";
const EMOTE_FILE = "./server/emotes.json";

if (!fs.existsSync(ADMIN_FILE)) {
  const hash = bcrypt.hashSync("SIYAMXEMOTE", 10);
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({ password: hash }, null, 2));
}
if (!fs.existsSync(EMOTE_FILE)) {
  fs.writeFileSync(EMOTE_FILE, JSON.stringify([], null, 2));
}

app.post("/admin/login", (req,res)=>{
  const {password}=req.body;
  const admin=JSON.parse(fs.readFileSync(ADMIN_FILE));
  if(bcrypt.compareSync(password, admin.password)) return res.json({success:true});
  res.status(401).json({success:false});
});

app.post("/admin/password",(req,res)=>{
  const {newPassword}=req.body;
  const hash=bcrypt.hashSync(newPassword,10);
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({password:hash},null,2));
  res.json({success:true});
});

app.get("/emotes",(req,res)=>{
  res.json(JSON.parse(fs.readFileSync(EMOTE_FILE)));
});

app.post("/admin/emotes",(req,res)=>{
  fs.writeFileSync(EMOTE_FILE, JSON.stringify(req.body,null,2));
  res.json({success:true});
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log("Running",PORT));


const fs = require("fs");
const adminFile = __dirname + "/admin.json";

app.post("/admin/change-password", (req, res) => {
  const { password } = req.body;
  const data = JSON.parse(fs.readFileSync(adminFile));
  data.adminPassword = password;
  fs.writeFileSync(adminFile, JSON.stringify(data));
  res.json({ ok: true });
});

app.post("/admin/check-password", (req, res) => {
  const { password } = req.body;
  const data = JSON.parse(fs.readFileSync(adminFile));
  res.json({ ok: data.adminPassword === password });
});
