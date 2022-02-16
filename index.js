const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use("/",router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1048777",
  key: "ebbfc5d80c211fb6817b",
  secret: "8aa15a887c87c474efc8",
  cluster: "eu",
  useTLS: true,
});


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
app.post('/api/value', (req,res) => {
    const {value} = req.body
    res.json({message: 'success'});
 pusher.trigger("my-channel", "my-event", {
         value,
 });
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);