// 1. Collect and prep ingredients
const db = require('../db');


// 2. Cook.
async function getAll() {
    const users = await db.any(`SELECT * FROM users`);

    const arrayOfPromises = users.map( async user => {
        const userTodos = await db.any(`SELECT * FROM todos WHERE user_id = $1`, [user.id])
        user.todos = userTodos
        return user;
    })

    const arrayOfUsersWithTodos = await Promise.all(arrayOfPromises);

    return arrayOfUsersWithTodos;
}
// async function getAll() {
//     const users = await db.any(`
//         select * from users
//     `);
//     console.log("We got users!");

//     return users;
// }

// Here's what we want from getOne():
// {
//     id: 1,
//     displayname: "alice",
//     username: "3l33th4x0r",
//     todos: [
//         {id:1, task: "walk the cat down the street."},
//         {}
//         {}
//     ]
// }

async function getOne(id) {
    try {
        const user = await db.one(`
            select * from users where id=$1
        `, [id]);
        
        const todosForUser = await db.any(`
            select * from todos where user_id=$1
        `, [user.id]);
    
        user.todos = todosForUser;
        return user;
    } catch (error) {
        console.log("There was an error retreiving user!");
        return {
            id: 0,
            displayname: "No user found"
        };
    }
}

// Accept an object argument so we have flexibility later on.
// That is, we can add more database columns
// without having to update all of our function calls.
// async function createUser(userDataObj) {
async function createUser({ displayname, username }) {
    // const { displayname, username } = userDataObj;
    const newUserInfo = await db.one(`
        insert into users
            (displayname, username)
        values ($1, $2)
        
        returning id

    `, [displayname, username]);

    console.log(newUserInfo);

    return newUserInfo;
}

// createUser({
//     displayname: "lalalalala",
//     username: "zazazazazazaza"
// })


// 3. Serve.
module.exports = {
    getAll,
    getOne,
    createUser
};