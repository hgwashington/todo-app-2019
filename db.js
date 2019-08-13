//import dotenv module call its .config method
require('dotenv').config()

const pgp =require('pg-promise')();
const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME, 
});

console.log(`working`)
//when you want 1 and only 1 use the .one() method
//That way when you use it it triggers the .catch()
function getOne(id){

    db.one(`
    select * from todos where id=$1
    
    `, [id])
        .then((data)=>{
    
    console.log(`here is the data `)
    console.log(data)
    
        })
        .catch((err)=>{
            console.log(`OH NOOO!`)
            console.log(err)
           
        })
}
getOne(1)