const express = require('express');
const path = require("path");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const e = require('express');

require("dotenv").config({path: "./.env"});



const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
/* {
    name : "Aayushi Joshi",
    username : "AJ",
    password : "123456",
    todos : [  
        { "id" : 1, "desc" : "Good Morning babe! " },
        { "id" : 2, "desc" : "Drink lots of water " },
        { "id" : 3, "desc" : "Go out for running " }
    ]
} */

app.use(cors());
app.use(express.json());


//read function returns the file as JSON object i.e. array of objects
function read(filePath){
    return new Promise((resolve, reject)=>{
        fs.readFile(filePath,"utf-8",(err,data)=>{
            if(err){        
                reject(err);
            }
            data = JSON.parse(data);
            resolve(data);
        })
    })
}


// write function writes into the JSON file ,updated database or todo.json should be given in json format
async function write(filePath, content){
    // let data = await read(filePath);
    // data.push(content);
    data = JSON.stringify(content);

    return new Promise((resolve,reject)=>{
        fs.writeFile(filePath, data,"utf-8",(err)=>{
            if(err){
                reject(err);
            }
            resolve("Successfully added user info in the database")
        })
    })
}

// (async function(){
//     try{
//         let r = await read("./todo.json");
//         console.log(r);
//     }
//     catch(e){
//         console.log(e.message);
//     }
// })();


app.post("/signup",async function(req,res){
    let fullName = req.body.name;
    let username = req.body.user;
    let password = req.body.pass;

    //input validation for unique username
    let data = await read("todo.json");
    let check = data.find(t=> t.username == username)
    if(check){
        return res.status(404).json({
            err : "USERNAME ALREADY EXISTS"
        })
    }


    //
    
    let content = {
        name : fullName,
        username : username,
        password : password,
        todos:[] 
    }

    data.push(content);


    try{
        let m = await write("todo.json",data);
        return res.json({
            message : m
        })
    }
    catch(err){
        return res.status(500).json({
            err : `internal server error ${err}`
        })
    }
})


app.post("/signin",async function(req,res){
    let username = req.body.user;
    let password = req.body.pass;
    let jwt_tk;

    //database check if this user exists or not
    let data = await read("todo.json");
    let foundUser = data.find(t => t.username===username && t.password===password);

    // if foundUser or not :-
    if(foundUser){
        jwt_tk = jwt.sign({
            username : foundUser.username
            // username : username
        },JWT_SECRET);

        return res.json({
            token : jwt_tk
        })
    }
    else{
        return res.status(400).json({
            err : "invalid username or password"
        })
    }

})

// CRUD Operations on Todo App [Create, Read, Update, Delete]

function auth(req,res,next){
    const token = req.headers.token;
    try{
        if(token){
            if(jwt.verify(token,JWT_SECRET)){
                req.headers.talk = jwt.verify(token,JWT_SECRET).username;
                next();
            }
        }
        else{
            return res.status(404).json({
                err : "Kindly Sign in to use our services"
            })
        }
    }
    catch(err){
        return res.status(404).json({
            err : "you are using fake token"
        })
    }
}
app.use(auth);

//Get Todos
app.get("/",async function(req,res){
    let user = req.headers.talk;    //getting the username of user from 'talk' key of request headers that's been verified from its token in the auth middleware

    try{
        let db = await read("todo.json");
        let todo = db.find(t => t.username === user);
    
        return res.json({
            name : todo.name,
            todoList : todo.todos
        });
    }
    catch(err){
        return res.json({
            err
        })
    }

})

//Create new Todo
app.post("/",async function(req,res){
    let user = req.headers.talk;    //getting the username of user from 'talk' key of request headers that's been verified from its token in the auth middleware
    let desc = req.body.desc;

    try{
        let rd =  await read("./todo.json");
        let foundUser = rd.find(t=>t.username === user );
    
        let len = foundUser.todos.length;  // id of new todo will be len+1
        let todos = foundUser.todos;
        todos.push({
            "id" : len+1,
            "desc" : desc,
            "status" : false
        })

        // res.json(rd);
        // console.log(rd);

        await write("./todo.json",rd);

        // for postman checking ---
        // let NEWrd =  await read("./todo.json");
        // res.json(NEWrd);
        
        return res.json({
            message : `successfully added new todo`
        });

    }
    catch(err){
        return res.json({err : err.message})
    }

})

//update todo

app.put("/",async function(req, res){
    let user = req.headers.talk;    //getting the username of user from 'talk' key of request headers that's been verified from its token in the auth middleware
    let id = req.body.id;
    let status = req.body.status;

    try{
        let data = await read("./todo.json");
        foundUs = data.find(t=> t.username === user);
        let todos = foundUs.todos;
        todos[id-1].status = status;

        await write("./todo.json",data);

        return res.json({
            message : "updated status of the todo"
        })
         
    }
    catch(err){
        return res.json({err : err.message})
    }
    res.json({})
})


app.put("/update",async function(req,res){
    let user = req.headers.talk;    //getting the username of user from 'talk' key of request headers that's been verified from its token in the auth middleware
    let id = req.body.id;
    let desc = req.body.desc;

    try{
        let data = await read("./todo.json");
        let foundUser = data.find(t => t.username == user );
        let todos = foundUser.todos;
        todos[id-1].desc = desc ;
    
        await write("./todo.json",data);
    
        return res.json({
            message : "updated the description of todo"
        })
    }
    catch(err){
        return res.json({err : err.message});
    }


})


//delete todo

app.delete("/",async function(req,res){
    let user = req.headers.talk;    //getting the username of user from 'talk' key of request headers that's been verified from its token in the auth middleware

    let id = req.body.id;  // so the todo which we are trying to delete is having index id-1

    let data = await read("./todo.json");
    let foundUs = data.find(t => t.username == user);
    let todos = foundUs.todos;
    todos.splice(id-1,1);   // removes the todo on index id-1

    // reconfiguring ids of todos
    for(let i=0; i<todos.length;i++){
        todos[i].id=i+1;
    }

    await write("./todo.json",data);

    return res.json({
        message : "deleted selected todo"
    })

})


app.listen(PORT, ()=>{
    console.log(`LISTENNING ON PORT ${PORT}...`)
})