//LGSI2023/routes/winecellar.js

module.exports = function(app){
    const express = require("express");
    const router = express.Router();
    const Wine = require("../models/wine");
    const mongoose = require("mongoose");

    router.route('/')
        .get(function(req, res){
            console.log("[WINE]:: wine info get request received!");
            Wine.findOne({_id: req.query.wineid})
                .then(function(wine){
                    console.log("[WINE]:: wine info get request success!");
                    console.log(wine);
                    res.json(wine);
                })
                .catch(function(err){
                    console.log("[WINE]:: wine info get request failed!");
                    console.log(err);
                    res.json(err);
                });
        });
    
    

    return router;
}

