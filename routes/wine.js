//LGSI2023/routes/winecellar.js

module.exports = function(app){
    const express = require("express");
    const router = express.Router();
    const Wine = require("../models/wine");
    const Aroma = require("../models/aroma");
    const AromaCategory = require("../models/aroma-category");
    const Cellar = require("../models/cellar");
    const mongoose = require("mongoose");

    // default get function => return 'this is wine route' and create log
    router.get("/", function(req, res){
        res.json("[WINECELLAR]:: this is wine route");
        console.log("[WINECELLAR]:: this is wine route");
    });
    
    router.get("/wineid", function(req, res){
        console.log("wine id request ")
        const wineid = new mongoose.Types.ObjectId(req.query.id);
        Wine.findOne({_id: wineid})
            .populate({
                path: 'aroma',
                model: Aroma,
                populate: { path: 'category',
                            model: AromaCategory
                        }
            })
            .then(function(wine){
                wine.toJSON;
                
                res.json(wine);
                console.log("찾았어요!");
            })
            .catch(function(err){
                res.json(err);
            });
    });

    return router;
}

