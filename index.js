
const { faker } = require("@faker-js/faker");
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password :'ATST@123NTjt'
  });
  let  getRandomUser = ( )=> {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  };

//   let q = "INSERT INTO user (id, username, email, password) VALUES ?"; //here not for arry of array (?,?,?,?)
//   let data =[];
//   for (let i = 0; i < 100; i++) { 
//     data.push(getRandomUser());
//   }
//   //   let users = [
// //   ["125","ayushi","si@gmail.com","dsgfdf"],
// //   ["124","ashu","som@gmail.com","sdfgwef"],

//     try{
//   connection.query(q,[data], (err,result) => {
//     if(err) throw err;
//     console.log(result);
    
//   });
// } catch(err){
//     console.log(err);
// }
// connection.end();
//Home
app.get("/",(req,res)=>{
  let q =`SELECT COUNT(*) FROM user`;
    try{
    connection.query(q, (err,result) => {
    if(err) throw err;
   let count= result[0]["COUNT(*)"];
    res.render("home.ejs",{count});
  });
} catch(err){
    console.log(err);
    res.send("the error is there");
}
});
//show data
app.get("/user",(req,res)=>{
  let q =`SELECT * FROM user`;
  try{
  connection.query(q, (err,users) => {
  if(err) throw err;
  res.render("showuser.ejs",{users});
});
} catch(err){
  console.log(err);
  res.send("the error is there");
}
});
app.get("/user/:id/edit",(req,res)=>{
  let { id} = req.params;
 console.log(id);
 let q = `select * from user where id ='${id}'`;

  try{
  connection.query(q, (err,result) => {
  let user = result[0];
    if(err) throw err;
  res.render("edit.ejs",{user});

});
} catch(err){
  console.log(err);
  res.send("the error is there");
}  
});
app.patch("/user/:id/",(req,res)=>{
  let { id} = req.params;
  let{password :newpassword ,username :newusername } = req.body;
  let q = `select * from user where id ='${id}'`;
   try{
   connection.query(q, (err,result) => {
     if(err) throw err;
     let user = result[0];
     if(newpassword != user.password){
      res.send("incorrect password");
     }else{
      let q2 = `update user SET username ='${newusername}'where id ='${id}'`; 
      connection.query(q2, (err,result) => {
        if(err) throw err;
        res.redirect("/user");
      });
    
    }
 });
 } catch(err){
   console.log(err);
   res.send("the error is there");
 }
});
app.listen(8080, ()=>{
console.log("port is listening 8080");
});
