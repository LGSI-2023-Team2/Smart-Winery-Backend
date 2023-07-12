//index.js

const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

require('dotenv').config();

//express setting
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//routes
app.use("/winecellar", require('./routes/winecellar')(app));
/*
app.use("/android", require('./routes/android')(app));
app.use("/refrigerator", require('./routes/refrigerator')(app)); */

app.get("/", function(req, res){
    console.log("test");
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