

const home = document.querySelector(".home");
const auth = document.querySelector(".auth");
const entry = document.querySelector(".entry");
const content = document.querySelector(".content");

// home.style.display = "none"; 
auth.style.display = "none"; 
entry.style.display = "none"; 
content.style.display = "none";

// let d = document.querySelector("dialog");
// d.showModal()


// Creating functionality for making user to send get reqeuest as soon as they enter the website
if(localStorage.tk){
    viewUser();
    home.style.display = "none";
    // content.style.display = "flex"; 
}


//session time out code, jwt token becomes invalid after sometime :-



document.getElementById("SupBut").addEventListener("click",function(){
    home.style.display = "none";
    auth.style.display = "flex"; 
})

document.getElementById("SinBut").addEventListener("click",function(){
    home.style.display = "none";
    entry.style.display = "flex"; 
})

document.getElementById("SignUpSubmit").addEventListener("click",async function(){
    let name = document.getElementById('SupName').value;
    let user = document.getElementById('SupUser').value.trim();
    let pass = document.getElementById('SupPass').value;

    if(name==="" || user==="" || pass===""){
        
        return alert("you have to fill all fields");
    }

    try{
        let response = await axios.post("http://localhost:3000/signup",
            {
                user : user,
                name : name,
                pass : pass
            },
            {
                headers : {"Content-Type" : "application/json"}
            }
        )

        document.getElementById('SupName').value = "";  
        document.getElementById('SupUser').value = "";  
        document.getElementById('SupPass').value = "";  
        auth.style.display = "none";
        entry.style.display = "flex";
        return alert(`Successfully Signed Up, Now Proceed to Sign In.`);
        // return alert(`Successfully Signed Up, Now Proceed to Sign In. Server Side Message : ${response.data.message}`);

        // if(response.data.message){
        // }

    }
    catch(err){
        return alert(err.response.data.err);
    }
})


document.getElementById("SignInSubmit").addEventListener("click",async function(){
    let user = document.getElementById("SinUser").value;
    let pass = document.getElementById("SinPass").value;

    try{
        let response = await axios.post("http://localhost:3000/signin",
            {
                user,
                pass
            },
            {
                headers : {"Content-Type" : "application/json"}
            }
        );
        
        const token = response.data.token;
        localStorage.tk = token;

        viewUser();
        document.getElementById("SinUser").value="";
        document.getElementById("SinPass").value="";
        entry.style.display = "none";
        content.style.display = "flex";  
        return alert(`Successfully Signed In, Enjoy your todosss`);        

    }
    catch(err){
        return alert(err.response.data.err);
    }
})

document.getElementById("BackfromSup").addEventListener("click",function(){

    document.getElementById('SupName').value = "";  
    document.getElementById('SupUser').value = "";  
    document.getElementById('SupPass').value = "";  
    home.style.display="flex";
    auth.style.display="none";
})

document.getElementById("backToSignIn").addEventListener("click",function(){
    document.getElementById('SupName').value = "";  
    document.getElementById('SupUser').value = "";  
    document.getElementById('SupPass').value = "";  
    entry.style.display="flex";
    auth.style.display="none";
})

document.getElementById("BackfromSin").addEventListener("click",function(){
    document.getElementById("SinUser").value="";
    document.getElementById("SinPass").value="";
    home.style.display="flex";
    entry.style.display="none";
})



document.getElementById("AddTodo").addEventListener("click",async function(){

    let desc = document.getElementById("addMore").value;
    try{
        let response = await axios.post("http://localhost:3000/",
            {
                desc : desc
            },
            {
                headers : {
                    token : localStorage.tk
                }   
            }
        );

        console.log(response.data.message);

        viewUser();
        

    }
    catch(err){

    }
})


// status of todos
document.addEventListener("click", async function(event){
    // eventLis = event.target;
    if(event.target.matches(`input[type="checkbox"]`)){
        let checkBoxStatus = event.target.checked;
        // console.log(checkBoxStatus);
        let elements = event.target.closest(".elements");
        let prnt = elements.parentElement;
        let str = prnt.className;
        // console.log(prnt.className)
        
        let id = str.split('m')[1];
        // console.log(typeof(id));
        // console.log(id);
    
        try{
            let reponse = await axios.put("http://localhost:3000/",
                {
                    id : id,
                    status : checkBoxStatus
                },
            {
                headers : {
                    token : localStorage.tk
                }
            },
            );
        }
        catch(err){
            console.log(err);
        }
    }
    // instead of doing following just write functions for onClick for buttons
    /* else if(event.target.matches("button")){
        if(event.target.id == "del"){
            console.log("update button")
        }
        else if(event.target.id == "edit"){
            console.log("update button")
        }
    } */
})


//deleting todo
async function delTodo(event){
    let item = event.target.closest(".buts").parentElement.className;
    let id = item.split('m')[1];      
    // console.log(event.target.closest(".buts").parentElement);      
    // console.log(event.target.closest(".buts").parentElement.className);      
    console.log(id);  

    try{
        let response = await axios.delete("http://localhost:3000/",{
            headers : { token : localStorage.tk },
            data : {id : id}
        }
        )

        console.log(response.data.message);

        viewUser();
    }
    catch(err){
        console.log(err);
    } 

}

async function editTodo(event){
    let item = event.target.closest(".buts").parentElement.className;
    let id = item.split('m')[1];      
    // console.log(event.target.closest(".buts").parentElement);      
    // console.log(event.target.closest(".buts").parentElement.className);      
    console.log(id);  

    let itm = event.target.closest(".buts").parentElement;
    let inpText = itm.querySelector(".text p").innerText;

    openDialog(inpText);

    let updatedDesc;

    document.querySelector(".updateButton").addEventListener("click",async function(){
        updatedDesc = document.querySelector(".updateText").value;

        itm.querySelector(".text p").innerText = updatedDesc;

        closeDialog();

        try{
            let response = await axios.put("http://localhost:3000/update",
                {
                    id : id,
                    desc : updatedDesc
                },
                {
                    headers : {token : localStorage.tk}
    
                }
            )
    
            console.log(response.data.message);
        }
        catch(err){
            console.log(err);
        }
    })

}

function openDialog(inpText){
    let dialog = document.createElement("dialog");
    let h3 = document.createElement("h3");
    h3.innerHTML = "Update Todo";

    let inp = document.createElement("input");
    inp.setAttribute("type","text");
    inp.setAttribute("class","updateText");
    inp.setAttribute("value",`${inpText}`);
    
    let buttons = document.createElement("div");
    buttons.setAttribute("class","buttons");
    let b1 = document.createElement("button");
    b1.setAttribute("class","updateButton");
    b1.innerHTML = "SAVE"

    buttons.appendChild(b1);

    dialog.appendChild(h3);
    dialog.appendChild(inp);
    dialog.appendChild(buttons);

    document.body.appendChild(dialog);

    let d = document.querySelector("dialog");
    d.showModal()
}

function closeDialog(){
    let d = document.querySelector("dialog");
    d.close();
    d.remove();
    // document.body.removeChild(dialog);
}


async function viewUser(){
    content.style.display = "flex"; 
    try{
        let response = await axios.get("http://localhost:3000/",
            {
                headers : {
                    token : localStorage.tk
                }
            });
    
        let data = response.data;
    
        render(data);
    }
    catch(err){
        return alert(err)
    }
}


function render(data){
    let NAME = data.name;
    let todoList = data.todoList;

    document.querySelector(".heading").children[0].children[0].innerHTML = `Hello : ${NAME}`;

    document.querySelector(".todos").innerHTML = "";

    todoList.forEach(t=>{
        let item = document.createElement("div");
        item.setAttribute("class",`item${t.id}`);
        
        let elements = document.createElement("div");
        elements.setAttribute("class",`elements`);

        let label = document.createElement("label");

        let check = document.createElement("div");
        check.setAttribute("class","check")
        let inp = document.createElement("input");
        inp.setAttribute("type","checkbox");
        inp.setAttribute("id","status")
        if(t.status){
            inp.checked = t.status;
        }

        let text = document.createElement("div");
        text.setAttribute("class","text");
        let p = document.createElement("p");
        p.innerHTML = t.desc;

        text.appendChild(p);
        check.appendChild(inp);
        label.appendChild(check);
        label.appendChild(text);
        elements.appendChild(label);


        let buts = document.createElement("div");
        buts.setAttribute("class",`buts`);

        let b1 = document.createElement("button");
        b1.setAttribute("id","del")
        b1.setAttribute("onclick","delTodo(event)");
        let im1 = document.createElement("img");
        im1.setAttribute("src","./remove.png");

        let b2 = document.createElement("button");
        b2.setAttribute("id","edit")
        b2.setAttribute("onclick","editTodo(event)");
        let im2 = document.createElement("img");
        im2.setAttribute("src","./pen.png");

        b1.appendChild(im1);
        b2.appendChild(im2);
        buts.appendChild(b2);
        buts.appendChild(b1);

        item.appendChild(elements);
        item.appendChild(buts);

        document.querySelector(".todos").appendChild(item);
    })
}


document.getElementById("logout").addEventListener("click",function(){
    localStorage.removeItem("tk");
    content.style.display = "none";
    home.style.display = "flex";

})


// const token = localStorage.token;

// const response = await axios.get("http://localhost:3000/",{
//     headers:{"token":token}
// });

// if(response.data){
// }
