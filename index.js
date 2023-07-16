//index.js

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

require('dotenv').config();

//express setting
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//routes
app.use("/winecellar", require('./routes/winecellar')(app));
//app.use("/wine", require('./routes/wine')(app));
/*
app.use("/android", require('./routes/android')(app));
app.use("/refrigerator", require('./routes/refrigerator')(app)); */

app.get("/", function(req, res){
    res.json("testing");
});


//DB configuration
var db = mongoose.connection;
db.on('error', err => {
  console.log(err);
});
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

//server starts
var server = app.listen(3000, function(){
  console.log("서버 시작!");
});