const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use("/",router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/chinook.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
  });


app.use(cors())


// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const initialData=()=>{
    let obj = {
        data: []
     };
    let dateNow = new Date();
    const timeGenerator=(i)=> {
      const timestamp =new Date(new Date(dateNow.getTime() - (8640-i+1)*1000))
      return timestamp  
    }
    for(let i=0;i<8640;i++){
        obj.data.push({Bitrate:6, time:timeGenerator(i)});
    }
return obj
};

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    res.json(initialData());
});
app.get('/api/getnum', (req,res) => {
    let sql = `SELECT num FROM value`;
    db.all(sql, [], (err, rows) => {
        res.json({num:rows[rows.length-1].num});
    });
});

app.post('/api/value', (req,res) => {
    const {value} = req.body
    db.run(`INSERT INTO value(num) VALUES(?)`, [req.body.value], function(err) {
        if (err) {
          return res.json({message: 'error'});
        }
        // get the last insert id
        res.json({message: 'success'});
      });
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);