//LGSI2023/routes/winecellar.js

module.exports = function(app){
    const express = require("express");
    const router = express.Router();
    const Wine = require("../models/wine");
    const Cellar = require("../models/cellar");
    const Cell = require("../models/cell");

    // !!! ROUTE TO / !!!
    router.route('/')
        // !!! GET !!!
        // !!! function to check the connectivity !!!
        .get(function(req, res){
            res.json("[WINECELLAR]:: this is winecellar")
            console.log("[WINECELLAR]:: this is winecellar");
        })
        // !!! DELETE !!!
        // !!! function to delete wine from winecellar !!!
        .delete(function(req, res){
            console.log("[WINECELLAR]:: delete request received");
            // step 1. find cellar
            Cellar.findOne({_id: req.body.cellarid})
                .populate({
                    path: 'floor1.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor2.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor3.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .then(function(cellar){
                    // step 2. find wine
                    var floor = req.body.row;
                    var cellID;
                    console.log(cellar);
                    if(floor == 1){
                        cellar.floor1.cell_ids.forEach(function(curCell){
                            console.log(curCell);
                            if(curCell.col == req.body.col){
                                cellID = curCell._id;
                                console.log("found!");
                            }
                        });
                    }
                    else if(floor == 2){
                        cellar.floor2.cell_ids.forEach(function(curCell){
                            if(curCell.col == req.body.col){
                                cellID = curCell._id;
                                console.log("found!");
                            }
                        });
                    }
                    else if(floor == 3){
                        cellar.floor3.cell_ids.forEach(function(curCell){
                            if(curCell.col == req.body.col){
                                cellID = curCell._id;
                                console.log("found!");
                            }
                        });
                    }
                    // step 3. delete wine
                    Cell.deleteOne({_id: cellID})
                        .then(function(msg){
                            console.log("[WINECELLAR]:: delete Success cellId: ", cellID);
                            res.json(cellar);
                        })
                        .catch(function(err){
                            res.json(err);
                            console.log("[WINECELLAR]:: delete failed");
                        })
                    
                })
                .catch(function(err){
                    res.json(err);
                    console.log("[WINECELLAR]:: drinking wine failed")
                })
        })

    // !!! ROUTE TO status !!!
    router.route('/status')
        // !!! GET !!!
        // !!! function to get cellar info !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: winecellar status request received");
            Cellar.findOne({_id: req.query.id})
                // since cell_id is related to cell
                .populate({
                    path: 'floor1.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor2.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .populate({
                    path: 'floor3.cell_ids',
                    model: Cell,
                    populate: {
                        path: 'wine_id',
                        model: Wine
                    }
                })
                .then(function(cellar){
                    console.log("[WINECELLAR]:: winecellar found");
                    console.log(cellar);
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
        
    router.route('/setting')
        // !!! GET !!!
        // !!! function to get cellar setting !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: winecellar setting request received");
            // step 1. find cellar
            Cellar.findOne({_id: req.query.id})
                .populate({
                    path: 'floor1.cell_ids',
                    model: Cell
                })
                .populate({
                    path: 'floor2.cell_ids',
                    model: Cell
                })
                .populate({
                    path: 'floor3.cell_ids',
                    model: Cell
                })
                .then(function(cellar){
                    // step 2. return cellar setting info
                    console.log("[WINECELLAR]:: winecellar found");
                    console.log(cellar);
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
        // !!! POST !!!
        // !!! function to set cellar setting !!!
        .post(function(req, res){
            console.log("[WINECELLAR]:: winecellar setting request received");
            var setting = req.body;
            // step 1. find cellar
            Cellar.findOne({_id: req.body.cellarid})
                .populate({
                    path: 'floor1.cell_ids',
                    model: Cell
                })
                .populate({
                    path: 'floor2.cell_ids',
                    model: Cell
                })
                .populate({
                    path: 'floor3.cell_ids',
                    model: Cell
                })
                .then(function(cellar){
                    // step 2. update cellar setting
                    console.log("[WINECELLAR]:: winecellar found");
                    console.log(cellar);
                    cellar.floor1.type = setting.floor1.type;
                    cellar.floor1.temperature_now = setting.floor1.temperature_now;
                    cellar.floor1.temperature_target = setting.floor1.temperature_target;
                    cellar.floor1.is_smart_mode = setting.floor1.is_smart_mode;
                    cellar.floor2.type = setting.floor2.type;
                    cellar.floor2.temperature_now = setting.floor2.temperature_now;
                    cellar.floor2.temperature_target = setting.floor2.temperature_target;
                    cellar.floor2.is_smart_mode = setting.floor2.is_smart_mode;
                    cellar.floor3.type = setting.floor3.type;
                    cellar.floor3.temperature_now = setting.floor3.temperature_now;
                    cellar.floor3.temperature_target = setting.floor3.temperature_target;
                    cellar.floor3.is_smart_mode = setting.floor3.is_smart_mode;
                    cellar.save();
                    res.json(cellar);


                    /* 
                    cellar.floor1.cell_ids.forEach(function(curCell){
                        if(curCell.col == setting.col){
                            curCell.type = setting.type;
                            curCell.temperature_now = setting.temperature_now;
                            curCell.temperature_target = setting.temperature_target;
                            curCell.is_smart_mode = setting.is_smart_mode;
                            curCell.save();
                        }
                    });
                    cellar.floor2.cell_ids.forEach(function(curCell){
                        if(curCell.col == setting.col){
                            curCell.temp = setting.temp;
                            curCell.humi = setting.humi;
                            curCell.save();
                        }
                    });
                    cellar.floor3.cell_ids.forEach(function(curCell){
                        if(curCell.col == setting.col){
                            curCell.temp = setting.temp;
                            curCell.humi = setting.humi;
                            curCell.save();
                        }
                    }); */
                    // step 3. return cellar setting info
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
        // !!! PUT !!!
        // !!! function to set cellar setting !!!
        .put(function(req, res){
            console.log("[WINECELLAR]:: winecellar setting request received");
            var setting = req.body;
            // step 1. find cellar
            Cellar.findOne({_id: req.body.cellarid})
                .populate({
                    path: 'floor1.cell_ids',
                    model: Cell
                })
                .populate({
                    path: 'floor2.cell_ids',
                    model: Cell
                })
                .populate({
                    path: 'floor3.cell_ids',
                    model: Cell
                })
                .then(function(cellar){
                    // step 2. update cellar setting
                    console.log("[WINECELLAR]:: winecellar found");
                    console.log(cellar);
                    cellar.floor1.type = setting.floor1.type;
                    cellar.floor1.temperature_now = setting.floor1.temperature_now;
                    cellar.floor1.temperature_target = setting.floor1.temperature_target;
                    cellar.floor1.is_smart_mode = setting.floor1.is_smart_mode;
                    cellar.floor2.type = setting.floor2.type;
                    cellar.floor2.temperature_now = setting.floor2.temperature_now;
                    cellar.floor2.temperature_target = setting.floor2.temperature_target;
                    cellar.floor2.is_smart_mode = setting.floor2.is_smart_mode;
                    cellar.floor3.type = setting.floor3.type;
                    cellar.floor3.temperature_now = setting.floor3.temperature_now;
                    cellar.floor3.temperature_target = setting.floor3.temperature_target;
                    cellar.floor3.is_smart_mode = setting.floor3.is_smart_mode;
                    cellar.save();
                    // step 3. return cellar setting info
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })

    
    
    return router;
}

