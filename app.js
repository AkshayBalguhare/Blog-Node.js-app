const express=require("express");
const app=express();
var bodyparser=require('body-parser');
var mongoose = require('mongoose');
var methodOverride=require("method-override");
const expressSanitizer=require("express-sanitizer");
mongoose.connect('mongodb://localhost/restfulblog', {useNewUrlParser: true,
useUnifiedTopology:true,'useFindAndModify':false });
app.use(express.static("public"));
app.set("view engine","ejs")
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
var port=process.env.Port|| 3000;

app.listen(port,()=>{
    console.log("server is running");
});

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date ,default:Date.now}
});
Blog=mongoose.model("Blog",blogSchema);
// Blog.create({
//     title:"Red Fort, Delhi",
//     image:"http://www.transindiatravels.com/wp-content/uploads/the-red-fort-delhi.jpg",
//     body:" The Red Fort was known as the capital of the Mughal Empire in India. Its construction is attributed to Shah Jahan who also built the famous Taj Mahal in Agra, and was also known by the name Quila Mubarak and remained the residence of the Mughal Imperial family for nearly 20 decades."
// })
app.get("/",(req,res)=>{
    res.redirect("/blogs");
})
app.get('/blogs',(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err)
        console.log("error:",err);
        else
        res.render("index",{blogs:blogs});
    })
})
app.post('/blogs',(req,res)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    console.log(req.body.blog);
    Blog.create(req.body.blog,(err,blog)=>{
        if(err)
        console.log("error:",err);
        else
        res.redirect("/blogs");
    })
})
app.get('/blogs/new',(req,res)=>{
    res.render("new")
})
app.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id,(err,foundblog)=>{
        if(err)
        console.log("error:",err);
        else
        res.render("show",{blog:foundblog});
    })
})
app.get("/blogs/:id/edit",(req,res)=>
{
    Blog.findById(req.params.id,(err,foundedblog)=>{
        if(err)
        console.log("error:",err);
        else
        res.render("edit",{blog:foundedblog});
    })
})
app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedblog)=>{
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs/"+req.params.id);
    })
})
app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndDelete(req.params.id,(err)=>{
        if(err)
        console.log("error:",err);
        res.redirect("/blogs");
    })
})
