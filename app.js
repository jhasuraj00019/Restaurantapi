const express = require('express');
const app = express();
const port  = process.env.PORT || 1200;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongourl = "mongodb+srv://second:mongo321@cluster0.khewj.mongodb.net/assignment4?retryWrites=true&w=majority";
let db;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//health Check
app.get('/',(req,res) => {
  res.send('Health Ok');
});

//city route (sorting)
app.get('/city',(req,res) => {
  const sortcondition = {city_name:1};
  if(req.query.sort && req.query.limit){
    let sortcontition = {city_name: Number(req.query.sort)}
    let limit = (req.query.limit);
  }
  else if(req.query.sort){
    let sortcondition = {city_name:Number(req.query.sort)}
  }
  else if(req.query.limit){
    let limit = (req.query.limit)
  }
  db.collection('city').find().sort(sortcondition).limit(limit).toArray((err,result)=> {
    if(err) throw err;
    res.send(result);
  })
});

//restaurant Route
app.get('/restaurant',(req,res) => {
  var condition = {};

  //Getting restaurant on the basis of cost and mealtype
  if(req.query.mealtype && req.query.lcost && req.query.hcost){
    condition = {$and:[{'type.mealtype': req.query.mealtype},
                {cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.hcost)}}]}
  }
  //Getting restraurant on the basis of MealType AND City
  else if(req.query.mealtype && req.query.city){
    condition = {$and:[{'type.mealtype': req.query.mealtype}, {city:req.query.city}]}
  }
  //Getting restaurant on the basis of mealType
  else if(req.query.mealtype){
    condition = {"type.mealtype": req.query.mealtype}
  }

  //Getting restaurant on the basis of city
  else if(req.query.city){
     condition = {city:req.query.city}
  }
  db.collection('restaurant').find(condition).toArray((err, result)=>{
    if(err) throw err;
    res.send(result)
  })
})

//MealType Route
app.get('/meal', (req,res) => {
  db.collection('mealType').find().toArray((err,result) => {
    if(err) throw err;
    res.send(result);
  })
})

//Placing Order
app.post('/placeorder',(req,res) => {
  db.collection('order').insert(req.body,(err,result) =>{
    if(err) throw err;
    res.send('Order Placed');
  })
})
//Getting Booking
app.get('/orders', (req, res)=> {
  db.collection('order').find({}).toArray((err,result) => {
    if(err) throw err;
    res.send(result)
  })
})

MongoClient.connect(mongourl,(err, connection) => {
  if(err) throw err;
  db = connection.db('assignment4');
  app.listen(port, (err) => {
    if(err) throw err;
    console.log(`Connection established with the dataBase on port ${port}`)
  })
})
