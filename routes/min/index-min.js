var express=require("express"),router=express.Router();router.get("/index",function(e,r,t){r.render("index",{title:"index"})}),module.exports=router;