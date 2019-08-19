// const http = require('http');
// Replace http with express
//
const express = require('express');
const Todo = require('./models/Todo');
const User = require('./models/User');
const { sanitizeBody } = require('express-validator');
const es6Renderer = require('express-es6-template-engine');

// Create the server and call it "app"
const app = express();
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');
//"static assets like css and js go to a directory called public"
app.use(express.static('public'))
// Use the urlencoded middleware
// to read POST bodies
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    console.log("I am middleware. yay.");
    console.log(req.url);
    // res.send("sorry");
    next();
});

// Create a variable for the port#
const port = 3333;

app.get('/', (req, res) => {
    res.render('index', {
        locals: {
            message: "It is time for lunch"
        },
        partials: {
            navbar: './navbar',
            includes:'includes'
        }
    });
});

app.get('/profile', (req,res) => {
    res.render('profile', {
        locals: {
            message: "It is time for lunch"
        },
        partials: {
            navbar:'navbar',
            includes:'includes'
            
        }
    });
 });
 app.get('/profile/todos', async (req,res) => {
     const userID = 1
     const theUser = await User.getOne(userID)
    res.render('todos', {
        locals: {
            todos: theUser.todos
        },
        partials: {
            navbar:'navbar',
            includes:'includes'

        }
    });
 });

//1.Get form for creating a todo
app.get('/profile/todos/create', (req,res)=>{
    //Render the "create new todoform template
    res.render('create-todo', {
        locals: {},
        partials: {
            navbar:'navbar',
            includes:'includes'

        }
    })
});
//2.process the body of the form they post
app.post('/profile/todos/create',[
    sanitizeBody('task').escape()
], async (req, res)=>{
    //handle the req.body from create new todo
console.log(req.body);

const taskID = await Todo.create(req.body.user_id, req.body);
res.send(taskID)
})

// const server = http.createServer((req, res) => {
// Replace with app.get()
app.get('/todos', (req, res) => {

    // "debugger" keyword adds a programmatic breakpoint
    // for the Chrome Dev Tools:
    // debugger;

    console.log("You've got a request!");
    const allTodos = Todo.getAll();
    allTodos        
        .then((data) => {
            console.log('OMG ITS DATAZZZZZZ');
            console.log(data);
            // res.end(JSON.stringify(data));
            res.json(data);
        })
    // console.log("\n\n\n===========================");
    // console.log(allTodos);
    // res.end(allTodos);
});

app.get('/todos/:taskId', (req, res) => {
    console.log("you asked for a specific task");
    console.log(req.params.taskId);

    // convert the route param to a number
    // and make sure it's in "base 10"
    const theId = parseInt(req.params.taskId, 10);
    const aTodo = Todo.getOne(theId);
    aTodo
        .then((data) => {
            res.json(data);
        });
});

app.get('/users', async (req, res) => {
    const allUsers = await User.getAll();
    res.json(allUsers);
});

app.get('/users/:userId', async (req, res) => {
    const theId = parseInt(req.params.userId, 10);
    const aUser = await User.getOne(theId);
    res.json(aUser);
});

app.post('/users', [
    sanitizeBody('username').escape(),
    sanitizeBody('displayname').escape()
], async (req, res) => {
    console.log("We got a POST request");
    // .send() is different from .end()
    
    console.log("Here is the body:");
    console.log(req.body);
    const newUserInfo = await User.createUser(req.body);
    res.json(newUserInfo);

    // const newUserInfo = await User.createUser({
    //     displayname: req.body.displayname,
    //     username: req.body.username
    // });
});

/*
Exercise: Add a POST route for creating todos for an existing user.
In the response, return the id of the new Todo.


Suggested format for route string:
*/
// app.post('/users/:userId/todos')

// server.listen(3000);
app.listen(port);