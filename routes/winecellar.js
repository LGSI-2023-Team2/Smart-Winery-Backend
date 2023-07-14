//LGSI2023/routes/winecellar.js

module.exports = function(app){
    const express = require("express");
    const router = express.Router();
    const Wine = require("../models/wine");
    const Aroma = require("../models/aroma");
    const AromaCategory = require("../models/aroma-category");
    const Cellar = require("../models/cellar");
    const mongoose = require("mongoose");

    // default get function => return and log 'this is winecellar'
    router.get("/", function(req, res){
        res.json("[WINECELLAR]:: this is winecellar")
        console.log("[WINECELLAR]:: this is winecellar");
    });

    router.post("/", function(req, res){
        console.log("winecellar initiate starting");
    });

    // received wine cellar id as get method, return wine cellar data
    router.get("/:cellarid", function(req, res){
        console.log("[WINECELLAR]:: winecellar id request received!");
        Cellar.findOne({_id: req.params.cellarid})
            .populate(floor1)
            .populate(floor2)
            .populate(floor3)
            .exec(function(err, cellar){
                if(err){
                    return res.return(err);
                }
                console.log("[WINECELLAR]:: winecellar found");
                res.json(cellar);
                console.log("[WINECELLAR]:: winecellar data returned!");
            });
        
    });
    
    /*
    // receive wine cellar id as param, row and col as body to drink wine 
    // first, find which cellar is clinet looking for,
    // second, delete wine from received data(row, col)
    router.delete("/:cellarid", function(req, res){
        // step 1. find cellar
        Cellar.findOne({_id: req.params.cellarid})
            .populate(
                path: ,
                model: 
            )
            .exec(function(err, cellar){
                if(err){
                    return res.return(err);
                }

                // step 2. erase wine
                
                
            });
    
        var wine = new Wine();
        Wine.findOne({barcode: req.query.winebarcode})
            .exec(function(err, wine_info){
                if(err){
                    return res.return(err);
                }
                wine = wine_info;
            });
    
    });
    
    router.get("/status", function(req, res){
        Cellar.findOne({_id: req.query.id})
            .populate('floor1.wine_ids')
            .populate('floor2.wine_ids')
            .populate('floor3.wine_ids')
            .exec(function(err, cellar){
                if(err){
                    return res.return(err);
                }
                res.json(cellar);
            });
    });
    
    router.post("/:cellarid/:floor", function(req, res){
        var floor = req.params.floor;
    });
    */
    return router;
}

