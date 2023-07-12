const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');


const app = express();
app.use(cors());
app.use(express.json());


//Using max limit request 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,       //15 minutes
    max: 100,       //max api request
    message: 'request to server is exceeded, Please try after 15 minutes'
});

app.use(limiter);

//Mongo DB connection
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/autoSave')
    .then(()=>console.log('connected to mongoDB'))
    .catch((err)=>console.log(err))


//MongoDB Schema 
const dataSchema = mongoose.Schema({
    user: String,
    text: String
});

//Model
const dataModel = mongoose.model('datas', dataSchema);



//API to save the text
app.post('/save', async (req, resp)=>{
    const textData = await dataModel.findOne({user:'tempUser'});
    if(!textData){
        const data = new dataModel(req.body);
        const save = await data.save();
    }
    else{
        const updated = await dataModel.updateOne({user:'tempUser'}, {$set: {text:req.body.text}}, {upsert:true});
        // console.log(updated);
    }

    resp.send({...req.body, status: 'ok'});
})


//API to fetch saved text from db
app.get('/getText', async(req, resp)=>{
    const data = await dataModel.findOne({user:'tempUser'});
    resp.send(data);
})

app.listen(8000, ()=>console.log("server is running at 8000"));