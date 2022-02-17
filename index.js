const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use("/",router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  // Publish a message to the test channel

app.use(cors())


// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

 initialData= async()=>{
    let obj = {
        data: []
     };
    let dateNow = new Date();
    const timeGenerator=(i)=> {
      const timestamp =new Date(new Date(dateNow.getTime() - (8640-i+1)*10000))
      return timestamp  
    }
    for(let i=0;i<8640;i++){
        obj.data.push({Bitrate:4, time:timeGenerator(i)});
    }
return obj
};

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    initialData().then((data) => {res.json(data)})
    
});
app.post('/api/value', (req,res) => {
    const {value} = req.body
    channel.publish('greeting', `${value}`);
    res.json({message:'success'})

});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
