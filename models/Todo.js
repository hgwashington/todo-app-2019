const db = require('../db');

async function getAll() {
    try {
        return await db.any(`
            select * from todos
        `);
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function getOne(id) {
    // When you want one and only one,
    // use the .one() method.
    // That way, if you don't find it,
    // it triggers the .catch().
    // This is better than doing an if/else
    // inside your .then().
    // .one() will throw an exception if it
    // gets anything but 1 and only 1 result.
    try {
        const aTodo = await db.one(`
            select * from todos where id=$1
        `, [id]);
        // debugger;
        return aTodo;
    } catch (error) {
        console.log("UH OH.");
        console.log(error);
        return {};
    }
}


function create(userId, todoObj) {
    const { task } = todoObj;
    const todoId = db.one(`
        insert into todos 
            (priority, task, user_id)
        values 
            (1, $2, $1)
    
        returning id        
    `, [userId, task]);

    return todoId;
}

module.exports = {
    // This is the same as
    // getAll: getAll,
    getAll,
    getOne,
    create
};