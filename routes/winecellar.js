//LGSI2023/routes/winecellar.js

const express = require("express");
const router = express.Router();
const Wine = require("../models/wine");
const Cellar = require("../models/cellar");

router.get("/", function(req, res){
    console.log("this is winecellar");
});

router.get("/winename", function(req, res){
    Wine.findOne({_id: req.query.id})
        .populate('aroma')
        .populate('pairing')
        .exec(function(err, wine){
            if(err){
                return res.return(err);
            }
            res.json(wine);
            console.log("찾았어요!");
            console.log(wine.eng_name);
            console.log(wine.imgsrc);
        });
});

router.get("/status", function(req, res){
    Cellar.findOne({_id: req.query.id})
        .populate('floor1.wine_ids')
        .populate('floor2.wine_ids')
        .populate('floor3.wine_ids')
        .exec(function(err, cellar){
            res.json(cellar);
        });
});