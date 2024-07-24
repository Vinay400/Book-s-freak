import express from "express";
import bodyparser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import  pkg  from "pg";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
const {Pool} = pkg;

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
});
export default pool;
app.set('views', path.join(__dirname, 'views'));
const db = new pg.Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD, 
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST
});
db.connect()
.then(()=> console.log('Connected to the database'))
.catch(err => console.error('Connection error', err.stack));
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
async function getbooks(){
    const result = await db.query("SELECT title,dateread::text As date_only,isbn,rating,description,amazonlink,id FROM books");
    return result.rows;
};
app.get("/", async(req, res )=>{
    try{
    let booksinformation = []; 
    const result = await getbooks();
    
    for(var i = 0; i < result.length; i++){
        booksinformation.push(result[i]);
    }
    res.render('index.ejs', {
        dataarray : booksinformation
    })
    booksinformation = [];
}
catch(error){
    console.log(error);

}});
app.get("/book/:title", async (req, res) => {
    try {
        const title = req.params.title;
        const cleanedtitle = title.replace(/:/g, '');
        let booksinformation = []; 
        const result = await db.query("SELECT title, dateread::text AS date_only, isbn, rating, description, amazonlink, notes, id FROM books WHERE title = $1", [cleanedtitle]);

        for (let i = 0; i < result.rows.length; i++) {
            booksinformation.push(result.rows[i]);
        }
        res.render('index2.ejs', {
            dataarray: booksinformation
        });
    } catch (error) {
        console.error(`Error querying the database: ${error.message}`);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/sortbytitle", async (req, res) => {
    try {
        let booksinformation = []; 
        const result = await db.query("SELECT title, dateread::text AS date_only, isbn, rating, description, amazonlink, id FROM books ORDER BY title");

        for (let i = 0; i < result.rows.length; i++) {
            booksinformation.push(result.rows[i]);
        }

        res.render('index.ejs', {
            dataarray: booksinformation
        });
    } catch (error) {
        console.error(`Error querying the database: ${error.message}`);
        res.status(500).send("Internal Server Error");
    }
   
});
app.get("/sortbynewest", async (req, res) => {
    try {
       
        let booksinformation = [];
        const result = await db.query("SELECT title, dateread::text AS date_only, isbn, rating, description, amazonlink, id FROM books ORDER BY date_only");

        for (let i = 0; i < result.rows.length; i++) {
            booksinformation.push(result.rows[i]);
        }

        res.render('index.ejs', {
            dataarray: booksinformation
        });

    } catch (error) {
        console.error(`Error querying the database: ${error.message}`);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/sortbybest", async (req, res) => {
    try {
       
        let booksinformation = [];
        const result = await db.query("SELECT title, dateread::text AS date_only, isbn, rating, description, amazonlink, id FROM books ORDER BY rating DESC");

        for (let i = 0; i < result.rows.length; i++) {
            booksinformation.push(result.rows[i]);
        }

        res.render('index.ejs', {
            dataarray: booksinformation
        });
        
    } catch (error) {
        console.error(`Error querying the database: ${error.message}`);
        res.status(500).send("Internal Server Error");
    }
});
app.post("/editdescription", async(req, res) => {
    let input = req.body.updateddescription;
    let id = req.body.updatedtitle || [];
    let title = req.body.title;
    console.log("Description: ", input);
    console.log("Title: ", title);
    console.log(id);

    if (!input || !id || !title) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const result = await db.query("UPDATE books SET description = $1 WHERE id = $2", [input, id]);
        res.redirect(`/book/:${title}`);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Error updating description');
    }
});



app.post("/editnotes" , async(req, res)=>{
    let input = req.body.updatednotes;
    let id = req.body.updatedtitle;
    let title = req.body.title;
    if (!input || !id || !title) {
        return res.status(400).send('Missing required fields');
    }
    try{
        const result = await db.query("UPDATE books SET description = $1 WHERE id = $2", [input, id]);
        res.redirect(`/book/:${title}`);
    } catch(err) {
        console.error(err.stack);
        res.status(500).send('Error updating description.');
    }
});
app.post("/editrating", async(req, res)=>{
    let id = req.body.updatedtitle;
    let title = req.body.title;
    let rating = req.body.rate;
    console.log(id);
    console.log(title);
    console.log(rating);
    if(!title || !id || !title){
        return res.status(400).send('Missing required fields');
    }
    try{
        await db.query("update books set rating = $1 where id = $2", [rating, id]); 
        res.redirect(`/book/:${title}`);
    }
    catch(err){
        console.log(err.stack);
        res.status(500).send('Error updating rating.');
    }
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
