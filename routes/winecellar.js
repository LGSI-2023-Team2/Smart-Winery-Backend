//LGSI2023/routes/winecellar.js

module.exports = function(app){
    const express = require("express");
    const router = express.Router();
    const Wine = require("../models/wine");
    const Cellar = require("../models/cellar");
    const Cell = require("../models/cell");
    //const Algorithm = require("./algorithm");

    // !!! ROUTE TO / !!!
    router.route('/')
        // !!! GET !!!
        // !!! function to initialize the winecellar !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: this is winecellar");
            Cellar.create({
                floor1: {},
                floor2: {},
                floor3: {}
            })
                .then(function(cellar){
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log(err);
                }
            );
        })
        // !!! POST !!!
        // !!! function to POST wine from winecellar !!!
        .post(function(req, res){
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
                    // step 2-1. find cell
                    var cellId;
                    if(req.body.row == 1){
                        cellar.floor1.cell_ids.forEach(function(cell){
                            if(cell.row == req.body.row && cell.col == req.body.col){
                                cellId = cell._id;
                                cellar.floor1.cell_ids.pull(cellId);
                            }
                        });
                    }
                    else if(req.body.row == 2){
                        cellar.floor2.cell_ids.forEach(function(cell){
                            if(cell.row == req.body.row && cell.col == req.body.col){
                                cellId = cell._id;
                                cellar.floor2.cell_ids.pull(cellId);
                            }
                        });
                    }
                    else if(req.body.row == 3){
                        cellar.floor3.cell_ids.forEach(function(cell){
                            if(cell.row == req.body.row && cell.col == req.body.col){
                                cellId = cell._id;
                                cellar.floor3.cell_ids.pull(cellId);
                            }
                        });
                    }
                    cellar.save();
                    // step 2-2. remove wine from cell
                    Cell.deleteOne({_id: cellId})
                        .then(function(){
                            console.log("[WINECELLAR]:: wine removed from cell");
                            res.json(cellar);
                        })
                        .catch(function(err){
                            console.log(err);
                            res.json(err);
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
                    console.log("[WINECELLAR]:: winecellar found and returned");
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
        
    // !!! ROUTE TO setting !!!
    router.route('/setting')
        // !!! GET !!!
        // !!! function to get cellar setting !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: winecellar setting request received");
            // step 1. find cellar
            Cellar.findOne({_id: req.query.id})
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
                .then(function(cellar){
                    // step 2. update cellar setting
                    console.log("[WINECELLAR]:: winecellar found");
                    console.log(cellar);
                    cellar.floor1.type = setting.floor1_type;
                    cellar.floor1.temperature_target = setting.floor1_temperature_target;
                    cellar.floor1.is_smart_mode = setting.floor1_is_smart_mode;
                    cellar.floor2.type = setting.floor2_type;
                    cellar.floor2.temperature_target = setting.floor2_temperature_target;
                    cellar.floor2.is_smart_mode = setting.floor2_is_smart_mode;
                    cellar.floor3.type = setting.floor3_type;
                    cellar.floor3.temperature_target = setting.floor3_temperature_target;
                    cellar.floor3.is_smart_mode = setting.floor3_is_smart_mode;
                    // step 3. return cellar setting info
                    cellar.save();
                    res.json(cellar);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })

    // !!! ROUTE TO cell !!!
    router.route('/cell')
        // !!! GET !!!
        // !!! function to ask client before put the wine !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: winecellar cell request received");
            // step 1. find cellar
            Cellar.findOne({_id: req.query.cellarid})
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
                .then(async function(cellar){
                    // step 2. find cell
                    console.log("[WINECELLAR]:: winecellar found");
                    var wine = await Wine.findOne({_id: req.query.wineid});
                    // step 3. check through algorithm
                    var wine_type;
                    if(wine.type == "Red"){wine_type = 1;}else if(wine.type == "White"){wine_type = 2;}else if(wine.type == "Sparkling"){wine_type = 3;}else{wine_type = 4;}
                    
                    console.log("[WINECELLAR]:: winecellar data returned");
                    var data = wineAlgorithm(wine.temp, wine_type, cellar);
                    console.log(data);
                    res.json(data);
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
        // !!! POST !!!
        // !!! function to put the wine !!!
        .post(async function(req, res){
            console.log("[WINECELLAR]:: winecellar cell add request received");
            // type 1: put wine into given cellar
            // type 2: move wines
            var wine = await Wine.findOne({_id: req.body.wineid});
            console.log(wine);
            // step 1. create cell with provided wine id
            Cell.create({
                row: req.body.row,
                col: req.body.col,
                wine_id: req.body.wineid
            })
                .then(function(cell){
                    // step 2. find cellar with provided cellar id
                    Cellar.findOne({_id: req.body.cellarid})
                        .then(async function(cellar){
                            // step 3. push cell id to cellar
                            // 1->RED 2->White 3->Sparkling 4->Rose, Fortified
                            console.log(req.body);
                            if(req.body.row == 1){
                                cellar.floor1.cell_ids.push(cell._id);
                            }
                            else if(req.body.row == 2){
                                cellar.floor2.cell_ids.push(cell._id);
                                
                            }
                            else if(req.body.row == 3){
                                cellar.floor3.cell_ids.push(cell._id);
                            }

                            // save setting
                            cellar.floor1.type = req.body.floor1.type;
                            cellar.floor1.temperature_target = req.body.floor1.temp_target;
                            cellar.floor1.is_smart_mode = req.body.floor1.is_smart_mode;
                            cellar.floor2.type = req.body.floor2.type;
                            cellar.floor2.temperature_target = req.body.floor2.temp_target;
                            cellar.floor2.is_smart_mode = req.body.floor2.is_smart_mode;
                            cellar.floor3.type = req.body.floor3.type;
                            cellar.floor3.temperature_target = req.body.floor3.temp_target;
                            cellar.floor3.is_smart_mode = req.body.floor3.is_smart_mode;
                            
                            await cellar.save();
                            res.json(cellar);
                        })
                        .catch(function(err){
                            console.log("[WINECELLAR]:: winecellar data ERROR!");
                            res.json(err);
                            return;
                        });
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                    return;
                });

        })
            
    // !!! ROUTE TO move !!!
    router.route('/move')
        // !!! GET !!!
        // !!! function to ask client before move the wine !!!
        .get(function(req, res){
            console.log("[WINECELLAR]:: winecellar move request received");
            res.json({message: "move request received"});
        })
        // !!! POST !!!
        // !!! function to move the wine !!!
        .post(function(req, res){
            console.log("[WINECELLAR]:: winecellar move request received");
            console.log(req.body);
            // step 1. remove wine from cellar
            // step 1-1. find cellar
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
                    // step 1-2. create cell
                    Cell.create({
                        row: req.body.wine2_row,
                        col: req.body.wine2_col,
                        wine_id: req.body.wine_id
                    })
                        .then(async function(cell){
                            // step 1-3. find wine
                            var wine = await Wine.findOne({_id: req.body.wine_id});
                            // step 1-4. save cell id to cellar !!! only when wine type match !!!
                            if(req.body.wine2_row == 1){
                                cellar.floor1.cell_ids.push(cell._id);
                            }
                            else if(req.body.wine2_row == 2){
                                cellar.floor2.cell_ids.push(cell._id);
                            }
                            else if(req.body.wine2_row == 3){
                                cellar.floor3.cell_ids.push(cell._id);
                            }
                            else{
                                console.log("[WINECELLAR]:: winecellar cell add ERROR!");
                                res.json({error: "wine type not match"});
                                return;
                            }

                            // step 2. delete cell from cellar
                            // step 2-1. find cell
                            var cellId;
                            if(req.body.wine1_row == 1){
                                cellar.floor1.cell_ids.forEach(function(cell){
                                    if(cell.row == req.body.wine1_row && cell.col == req.body.wine1_col){
                                        cellId = cell._id;
                                        cellar.floor1.cell_ids.pull(cellId);
                                    }
                                });
                            }
                            else if(req.body.wine1_row == 2){
                                cellar.floor2.cell_ids.forEach(function(cell){
                                    if(cell.row == req.body.wine1_row && cell.col == req.body.wine1_col){
                                        cellId = cell._id;
                                        cellar.floor2.cell_ids.pull(cellId);
                                    }
                                });
                            }
                            else if(req.body.wine1_row == 3){
                                cellar.floor3.cell_ids.forEach(function(cell){
                                    if(cell.row == req.body.wine1_row && cell.col == req.body.wine1_col){
                                        cellId = cell._id;
                                        cellar.floor3.cell_ids.pull(cellId);
                                    }
                                });
                            }
                            
                            // step 2-2. remove wine from cell
                            await Cell.deleteOne({_id: cellId});
                            cellar.save();
                            res.json(cellar);
                        })
                        .catch(function(err){
                            console.log("[WINECELLAR]:: winecellar data ERROR!");
                            res.json(err);
                            return;
                        }
                    );
                })
                .catch(function(err){
                    console.log("[WINECELLAR]:: winecellar data ERROR!");
                    res.json(err);
                });
        })
            
    return router;
}

function wineAlgorithm(input_wine_temp, input_wine_category, cellar_json){
    var jsonData = {
        "type": 1,
        "msg": [
        ],
        "input_row": 1,
        "input_col": 1,
        "floor1": {
            "type": 1,
            "temp_target": 10,
            "is_smart_mode": true
        },
        "floor2": {
            "type": 1,
            "temp_target": 10,
            "is_smart_mode": true
        },
        "floor3": {
            "type": 1,
            "temp_target": 10,
            "is_smart_mode": true
        },
        "move_wine": [
        ]
    };
    var wine_cellar = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    var is_smart_arr = [1, 1, 1];
    var wine_categories = [3, 2, 3];
    
    jsonData.floor1.temp_target = cellar_json.floor1.temperature_target;
    jsonData.floor2.temp_target = cellar_json.floor2.temperature_target;
    jsonData.floor3.temp_target = cellar_json.floor3.temperature_target;

    jsonData.floor1.type = cellar_json.floor1.type;
    wine_categories[0] = cellar_json.floor1.type;
    jsonData.floor2.type = cellar_json.floor2.type;
    wine_categories[1] = cellar_json.floor2.type;
    jsonData.floor3.type = cellar_json.floor3.type;
    wine_categories[2] = cellar_json.floor3.type;
    
    jsonData.floor1.is_smart_mode = cellar_json.floor1.is_smart_mode;
    jsonData.floor2.is_smart_mode = cellar_json.floor2.is_smart_mode;
    jsonData.floor3.is_smart_mode = cellar_json.floor3.is_smart_mode;

    cellar_json.floor1.cell_ids.forEach(element => {
        wine_cellar[(element.row - 1) * 5 + element.col - 1] = element.wine_id.temp
    });

    cellar_json.floor2.cell_ids.forEach(element => {
        wine_cellar[(element.row - 1) * 5 + element.col - 1] = element.wine_id.temp
    });

    cellar_json.floor3.cell_ids.forEach(element => {
        wine_cellar[(element.row - 1) * 5 + element.col - 1] = element.wine_id.temp
    })

    if(cellar_json.floor1.is_smart_mode == true){
        is_smart_arr[0] = 1;
    }
    else{
        is_smart_arr[0] = 0;
    }

    if(cellar_json.floor2.is_smart_mode == true){
        is_smart_arr[1] = 1;
    }
    else{
        is_smart_arr[1] = 0;
    }

    if(cellar_json.floor3.is_smart_mode == true){
        is_smart_arr[2] = 1;
    }
    else{
        is_smart_arr[2] = 0;
    }

    var input_wine_floor;
    var white_count = 0;
    var red_count = 0;
    var spark_count = 0;
    var same_cate_arr = [];
    var empty_check = 0;
    var cate_check = 0;
    var diff = 1000000;
    var cur_cellar_count = [0, 0, 0];
    var cur_cellar_temp = [0, 0, 0];
    var next_temp = 0;
    var not_this_cate = [];
    var white_floor_count = 0;
    var red_floor_count = 0;
    var spark_floor_count = 0;

    if ((input_wine_temp > 30) || (input_wine_temp < 0)){
        jsonData.type = 0;
        jsonData.msg.push("Wine recomment temperature is out of boundary!");
        return jsonData;
    }

    //비어있는 칸이 있는지 찾기
    for(var i = 0; i < 15; i++){
        if(wine_cellar[i] == -1){
            empty_check = 1;
        }
    }

    //모든 칸이 차있는 경우
    if(empty_check == 0){
        jsonData.type = 0;
        jsonData.msg("Wine cellar is already full!");
        return jsonData;
    }

    // 각 층 평균 온도와 와인 갯수 구하기
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 5; j++){
            if(wine_cellar[i * 5 + j] != -1){
                cur_cellar_count[i]++;
                cur_cellar_temp[i] += wine_cellar[i * 5 + j];
            }
        }
        if(cur_cellar_count[i] != 0){
            cur_cellar_temp[i] /= cur_cellar_count[i];
        }
        console.log(1,cur_cellar_temp[i],cur_cellar_temp);
    }

    // input와인과 같은 카테고리인 층 중 빈칸 찾기
    empty_check = 0;
    cate_check = 0;
    for(var i = 0; i < 3; i++){
        if((wine_categories[i] == input_wine_category) && (is_smart_arr[i] == 1)){
            for(var j = 0; j < 5; j++){
                if(wine_cellar[i * 5 + j] == -1){
                    empty_check = 1;
                }
            }
            if(empty_check == 1){
                same_cate_arr.push(i);
            }
            empty_check = 0;
            cate_check = 1;
        }
    }

    if(cate_check == 1){ // 같은 카테고리가 있을때
        if(same_cate_arr.length != 0){
            //같은 카테고리가 있고 그 칸이 비었을때 칸들 중 가장 좋은 칸 찾아주기
            console.log("same_cate_arr.length != 0");
            for(var i = 0; i < same_cate_arr.length; i++){
                if(diff > Math.abs(cur_cellar_temp[same_cate_arr[i]] - input_wine_temp)){
                    diff = Math.abs(cur_cellar_temp[same_cate_arr[i]] - input_wine_temp);
                    input_wine_floor = i;
                }
            }
        
            for(var i = 0; i < 5; i++){
                if(wine_cellar[input_wine_floor * 5 + i] == -1){
                    console.log("1번 옮기기1");
                    next_temp = Math.round((cur_cellar_temp[input_wine_floor] * cur_cellar_count[input_wine_floor] + input_wine_temp) / (cur_cellar_count[input_wine_floor] + 1));
                    jsonData.input_row = input_wine_floor + 1;
                    jsonData.input_col = i + 1;
                    jsonData.msg.push("1번 옮기기");
                    jsonData.type = 1;
                    if(input_wine_floor == 0){
                        jsonData.floor1.temp_target = next_temp;
                    }
                    else if(input_wine_floor == 1){
                        jsonData.floor2.temp_target = next_temp;
                    }
                    else if(input_wine_floor == 2){
                        jsonData.floor3.temp_target = next_temp;
                    }
                    return jsonData;
                }
            }
        }
        else{
            for(var i = 0; i < 3; i++){
                if(cur_cellar_count[i] == 0){ // 어떤 비어있는 칸이 있는 경우
                    jsonData.input_row = i + 1;
                    jsonData.input_col = 1;
                    jsonData.msg.push("i 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로5, 카테고리도 바꾸고 스마트모드도 킴");
                    jsonData.type = 1;
                    if(i == 0){
                        jsonData.floor1.temp_target = input_wine_temp;
                        jsonData.floor1.type = input_wine_category;
                        jsonData.floor1.is_smart_mode = true;
                    }
                    else if(i == 1){
                        jsonData.floor2.temp_target = input_wine_temp;
                        jsonData.floor2.type = input_wine_category;
                        jsonData.floor2.is_smart_mode = true;
                    }
                    else if(i == 2){
                        jsonData.floor3.temp_target = input_wine_temp;
                        jsonData.floor3.type = input_wine_category;
                        jsonData.floor3.is_smart_mode = true;
                    }
                    return jsonData;
                }
            }

            //같은 카테고리가 있기는 한데 그 칸들이 모두 차있는 경우
            for(var i = 0; i < 3; i++){
                if(is_smart_arr[i] == 0){ // 스마트 모드가 꺼진 칸에서
                    if(cur_cellar_count[i] != 5){ // 그 칸에서 빈 것이 있는 경우
                        for(var j = 0; j < 5; j++){ 
                            if(wine_cellar[i * 5 + j] == -1){
                                next_temp = int((cur_cellar_temp[i] * cur_cellar_count[i] + input_wine_temp) / (cur_cellar_count[i] + 1));
                                jsonData.input_row = i + 1;
                                jsonData.input_col = j + 1;
                                jsonData.msg.push("user mode인 i+1번째 j+1에 와인을 넣음 온도는 그전과 같게 유지");
                                jsonData.type = 1;

                                return jsonData;
                            }
                        }
                    }
                }
            }

            for(var i = 0; i < 3; i++){
                if((wine_categories[i] != input_wine_category) || (is_smart_arr[i] == 0)){
                    not_this_cate.push(i);
                }
            }

            if(not_this_cate.length == 1){
                if(cur_cellar_count[not_this_cate[0]] == 0){
                    jsonData.input_row = not_this_cate[0] + 1;
                    jsonData.input_col = 1;
                    jsonData.msg.push("not_this_cate[0] 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로, 스마트모드도켜주고 그 와인 카테고리로5");
                    jsonData.type = 1;
                    if(not_this_cate[0] == 0){
                        jsonData.floor1.temp_target = input_wine_temp;
                        jsonData.floor1.type = input_wine_category;
                        jsonData.floor1.is_smart_mode = true;
                    }
                    else if(not_this_cate[0] == 1){
                        jsonData.floor2.temp_target = input_wine_temp;
                        jsonData.floor2.type = input_wine_category;
                        jsonData.floor2.is_smart_mode = true;
                    }
                    else if(not_this_cate[0] == 2){
                        jsonData.floor3.temp_target = input_wine_temp;
                        jsonData.floor3.type = input_wine_category;
                        jsonData.floor3.is_smart_mode = true;
                    }

                    return jsonData;
                }
                if(is_smart_arr[not_this_cate[0]] == 0){
                    for(var j = 0; j < 5; j++){ 
                        if(wine_cellar[not_this_cate[0] * 5 + j] == -1){
                            jsonData.input_row = not_this_cate[0] + 1;
                            jsonData.input_col = j + 1;
                            jsonData.msg.push("not_this_cate[0] 층에 j번째에 해당 와인 넣기, 그 층의 온도는 유지");
                            jsonData.type = 1;

                            return jsonData;
                        }
                    }
                }
            }
            else{
                for(var i = 0; i < not_this_cate.length; i++){
                    if(cur_cellar_count[not_this_cate[i]] == 0){
                        jsonData.input_row = not_this_cate[i] + 1;
                        jsonData.input_col = 1;
                        jsonData.msg.push("not_this_cate[i] 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로 바꾸기, category도 inputwine으로 바꾸기8");
                        jsonData.type = 1;
                        if(not_this_cate[i] == 0){
                            jsonData.floor1.temp_target = input_wine_temp;
                            jsonData.floor1.type = input_wine_category;
                            jsonData.floor1.is_smart_mode = true;
                        }
                        else if(not_this_cate[i] == 1){
                            jsonData.floor2.temp_target = input_wine_temp;
                            jsonData.floor2.type = input_wine_category;
                            jsonData.floor2.is_smart_mode = true;
                        }
                        else if(not_this_cate[i] == 2){
                            jsonData.floor3.temp_target = input_wine_temp;
                            jsonData.floor3.type = input_wine_category;
                            jsonData.floor3.is_smart_mode = true;
                        }

                        return jsonData;
                    }
                }
                if((is_smart_arr[not_this_cate[0]] == 1) && (is_smart_arr[not_this_cate[1]] == 1)){
                    if(wine_categories[not_this_cate[0]] == wine_categories[not_this_cate[1]]){
                        if((cur_cellar_count[not_this_cate[0]] + cur_cellar_count[not_this_cate[1]]) <= 5){
                            if(cur_cellar_count[not_this_cate[0]] >= cur_cellar_count[not_this_cate[1]]){
                                for(var q = 0; q < 5; q++){
                                    if(wine_cellar[not_this_cate[1] * 5 + q] != -1){
                                        for(var p = 0; p < 5; p++){
                                            if(wine_cellar[not_this_cate[0] * 5 + p] == -1){
                                                wine_cellar[not_this_cate[0] * 5 + p] = wine_cellar[not_this_cate[1] * 5 + q];
                                                wine_cellar[not_this_cate[1] * 5 + q] == -1
                                                jsonData.move_wine.push({
                                                    "cur_row" : not_this_cate[1] + 1,
                                                    "cur_col" : q + 1,
                                                    "next_row" : not_this_cate[0] + 1,
                                                    "next_col" : p + 1
                                                })
                                                break;
                                            }
                                        }
                                    }
                                }
                                
                                jsonData.input_row = not_this_cate[1] + 1;
                                jsonData.input_col = 1;
                                jsonData.msg.push("not_this_cate[1] 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_temp로 바꾸기, 카테고리도 바꾸고 스마트모드도 켜주기7");
                                jsonData.type = 2;
                                if(not_this_cate[1] == 0){
                                    jsonData.floor1.temp_target = input_wine_temp;
                                    jsonData.floor1.type = input_wine_category;
                                    jsonData.floor1.is_smart_mode = true;
                                }
                                else if(not_this_cate[1] == 1){
                                    jsonData.floor2.temp_target = input_wine_temp;
                                    jsonData.floor2.type = input_wine_category;
                                    jsonData.floor2.is_smart_mode = true;
                                }
                                else if(not_this_cate[1] == 2){
                                    jsonData.floor3.temp_target = input_wine_temp;
                                    jsonData.floor3.type = input_wine_category;
                                    jsonData.floor3.is_smart_mode = true;
                                }


                                cur_cellar_temp = [0, 0, 0];
                                cur_cellar_count = [0, 0, 0];
                                // 각 층 평균 온도와 와인 갯수 구하기
                                for(var i = 0; i < 3; i++){
                                    for(var j = 0; j < 5; j++){
                                        if(wine_cellar[i * 5 + j] != -1){
                                            cur_cellar_count[i]++;
                                            cur_cellar_temp[i] += wine_cellar[i * 5 + j];
                                        }
                                    }
                                    if(cur_cellar_count[i] != 0){
                                        cur_cellar_temp[i] = int(cur_cellar_temp[i] / cur_cellar_count[i]);
                                    }
                                }

                                if(jsonData.floor1.is_smart_mode == true){
                                    jsonData.floor1.temp_target = cur_cellar_temp[0];
                                }
                                if(jsonData.floor2.is_smart_mode == true){
                                    jsonData.floor2.temp_target = cur_cellar_temp[1];
                                }
                                if(jsonData.floor3.is_smart_mode == true){
                                    jsonData.floor3.temp_target = cur_cellar_temp[2];
                                }

                                return jsonData;
                            }
                            else{
                                for(var q = 0; q < 5; q++){
                                    if(wine_cellar[not_this_cate[0] * 5 + q] != -1){
                                        for(var p = 0; p < 5; p++){
                                            if(wine_cellar[not_this_cate[1] * 5 + p] == -1){
                                                wine_cellar[not_this_cate[1] * 5 + p] = wine_cellar[not_this_cate[0] * 5 + q];
                                                wine_cellar[not_this_cate[0] * 5 + q] == -1
                                                jsonData.move_wine.push({
                                                    "cur_row" : not_this_cate[0] + 1,
                                                    "cur_col" : q + 1,
                                                    "next_row" : not_this_cate[1] + 1,
                                                    "next_col" : p + 1
                                                })
                                                break;
                                            }
                                        }
                                    }
                                }

                                jsonData.input_row = not_this_cate[0] + 1;
                                jsonData.input_col = 1;
                                jsonData.msg.push("not_this_cate[0] 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_temp로 바꾸기7");
                                jsonData.type = 2;
                                if(not_this_cate[0] == 0){
                                    jsonData.floor1.temp_target = input_wine_temp;
                                    jsonData.floor1.type = input_wine_category;
                                    jsonData.floor1.is_smart_mode = true;
                                }
                                else if(not_this_cate[0] == 1){
                                    jsonData.floor2.temp_target = input_wine_temp;
                                    jsonData.floor2.type = input_wine_category;
                                    jsonData.floor2.is_smart_mode = true;
                                }
                                else if(not_this_cate[0] == 2){
                                    jsonData.floor3.temp_target = input_wine_temp;
                                    jsonData.floor3.type = input_wine_category;
                                    jsonData.floor3.is_smart_mode = true;
                                }


                                cur_cellar_temp = [0, 0, 0];
                                cur_cellar_count = [0, 0, 0];
                                // 각 층 평균 온도와 와인 갯수 구하기
                                for(var i = 0; i < 3; i++){
                                    for(var j = 0; j < 5; j++){
                                        if(wine_cellar[i * 5 + j] != -1){
                                            cur_cellar_count[i]++;
                                            cur_cellar_temp[i] += wine_cellar[i * 5 + j];
                                        }
                                    }
                                    if(cur_cellar_count[i] != 0){
                                        cur_cellar_temp[i] = int(cur_cellar_temp[i] / cur_cellar_count[i]);
                                    }
                                }

                                if(jsonData.floor1.is_smart_mode == true){
                                    jsonData.floor1.temp_target = cur_cellar_temp[0];
                                }
                                if(jsonData.floor2.is_smart_mode == true){
                                    jsonData.floor2.temp_target = cur_cellar_temp[1];
                                }
                                if(jsonData.floor3.is_smart_mode == true){
                                    jsonData.floor3.temp_target = cur_cellar_temp[2];
                                }

                                return jsonData;
                            }
                        }
                        else{
                            jsonData.type = 0;
                            jsonData.msg("Wine can not add!12");
                            return jsonData;
                        }
                    }
                    else{
                        jsonData.type = 0;
                        jsonData.msg("Wine can not add!13")
                        return jsonData;
                    }
                }
                else if((is_smart_arr[not_this_cate[0]] == 0) && (is_smart_arr[not_this_cate[1]] == 1)){
                    if(cur_cellar_count[not_this_cate[0]] == 5){
                        jsonData.type = 0;
                        jsonData.msg("Wine can not add!14")
                        return jsonData;
                    }
                    else{
                        for(var j = 0; j < 5; j++){ 
                            if(wine_cellar[not_this_cate[0] * 5 + j] == -1){
                                jsonData.input_row = not_this_cate[0] + 1;
                                jsonData.input_col = j + 1;
                                jsonData.msg.push("not_this_cate[0] 층에 j번째에 해당 와인 넣기, 그 층의 온도는 유지7");
                                jsonData.type = 1;
                                return jsonData;
                            }
                        }
                    }
                }
                else if((is_smart_arr[not_this_cate[0]] == 1) && (is_smart_arr[not_this_cate[1]] == 0)){
                    if(cur_cellar_count[not_this_cate[1]] == 5){
                        jsonData.type = 0;
                        jsonData.msg("Wine can not add!15")
                        return jsonData;
                    }
                    else{
                        for(var j = 0; j < 5; j++){ 
                            if(wine_cellar[not_this_cate[1] * 5 + j] == -1){
                                jsonData.input_row = not_this_cate[1] + 1;
                                jsonData.input_col = j + 1;
                                jsonData.msg.push("not_this_cate[1] 층에 j번째에 해당 와인 넣기, 그 층의 온도는 유지7");
                                jsonData.type = 1;
    
                                return jsonData;
                            }
                        }
                    }
                }
                else{
                    if(cur_cellar_count[not_this_cate[0]] == 5){
                        if(cur_cellar_count[not_this_cate[1]] == 5){
                            jsonData.type = 0;
                            jsonData.msg("Wine can not add!16")
                            return jsonData;
                        }
                        else{
                            for(var k = 0; k < 5; k++){
                                if(wine_cellar[not_this_cate[1] * 5 + k] == -1){
                                    jsonData.input_row = not_this_cate[1] + 1;
                                    jsonData.input_col = k + 1;
                                    jsonData.msg.push("not_this_cate[1] 층에 k번째에 해당 와인 넣기, 그 층의 온도는 그대로 유지7");
                                    jsonData.type = 1;
        
                                    return jsonData;
                                }
                            }
                        }
                    }
                    else if(cur_cellar_count[not_this_cate[1]] == 5){
                        jsonData.type = 0;
                        jsonData.msg("Wine can not add!17")
                        return jsonData;
                    }
                    else{
                        if((Math.abs(cur_cellar_temp[not_this_cate[0]] - input_wine_temp)) <= (Math.abs(cur_cellar_temp[not_this_cate[1]] - input_wine_temp))){
                            for(var k = 0; k < 5; k++){
                                if(wine_cellar[not_this_cate[0] * 5 + k] == -1){
                                    empty_space = k;
                                    break;
                                }
                            }
                            jsonData.input_row = not_this_cate[0] + 1;
                            jsonData.input_col = empty_space + 1;
                            jsonData.msg.push("not_this_cate[0] 층에 empty_space번째에 해당 와인 넣기 온도는 그대로 유지17");
                            jsonData.type = 1;

                            return jsonData;
                        }
                        else{
                            for(var k = 0; k < 5; k++){
                                if(wine_cellar[not_this_cate[1] * 5 + k] == -1){
                                    empty_space = k;
                                    break;
                                }
                            }
                            jsonData.input_row = not_this_cate[1] + 1;
                            jsonData.input_col = empty_space + 1;
                            jsonData.msg.push("not_this_cate[1] 층에 empty_space번째에 해당 와인 넣기, 그 층의 온도는 그대로 유지17");
                            jsonData.type = 1;
                            return jsonData;
                        }
                    }
                }
            }

        }
    }
    else{ // 같은 카테고리가 없는 경우

        for(var i = 0; i < 3; i++){
            if(cur_cellar_count[i] == 0){//빈 층이 있는 경우
                jsonData.input_row = i + 1;
                jsonData.input_col = 1;
                jsonData.msg.push("i 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로 바꾸기, category도 inputwine으로 바꾸기8");
                jsonData.type = 1;
                if(i == 0){
                    jsonData.floor1.temp_target = input_wine_temp;
                    jsonData.floor1.type = input_wine_category;
                    jsonData.floor1.is_smart_mode = true;
                }
                else if(i == 1){
                    jsonData.floor2.temp_target = input_wine_temp;
                    jsonData.floor2.type = input_wine_category;
                    jsonData.floor2.is_smart_mode = true;
                }
                else if(i == 2){
                    jsonData.floor3.temp_target = input_wine_temp;
                    jsonData.floor3.type = input_wine_category;
                    jsonData.floor3.is_smart_mode = true;
                }

                return jsonData;
            }
        }

        white_count = 0;
        red_count = 0;
        spark_count = 0;
        white_floor_count = 0;
        red_floor_count = 0;
        spark_floor_count = 0;
        var red_count_arr = [0, 0, 0];
        var white_count_arr = [0, 0, 0];
        var spark_count_arr = [0, 0, 0];
        var red_floor = [];
        var white_floor = [];
        var spark_floor = [];


        for(var i = 0; i < 3; i++){
            if(is_smart_arr[i] != 0){
                if(wine_categories[i] == 1){
                    for(var j = 0; j < 5; j++){
                        if(wine_cellar[i * 5 + j] != -1){
                            red_count++;
                            red_count_arr[i]++;
                        }
                    }
                    red_floor_count++;
                    red_floor.push(i);
                }
                else if(wine_categories[i] == 2){
                    for(var j = 0; j < 5; j++){
                        if(wine_cellar[i * 5 + j] != -1){
                            white_count++;
                            white_count_arr[i]++;
                        }
                    }
                    white_floor_count++;
                    white_floor.push(i);
                }
                else if(wine_categories[i] == 3){
                    for(var j = 0; j < 5; j++){
                        if(wine_cellar[i * 5 + j] != -1){
                            spark_count++;
                            spark_count_arr[i]++;
                        }
                    }
                    spark_floor_count++;
                    spark_floor.push(i);
                }
            }
        }

        var temp_min = 100000;
        var min_floor = 10000;

        if((red_count) <= (red_floor_count-1) * 5){
            //레드 몰아주기
            for(var i = 0; i < red_floor.length; i++){
                if(temp_min > red_count_arr[red_floor[i]]){
                    min_floor = red_floor[i];
                }
            }
            
            //min_floor에 있는 레드 와인을 다른 레드와인 칸에 옮기기
            for(var i = 0; i < red_floor.length; i++){
                if(min_floor != red_floor[i]){
                    for(var j = 0; j < 5; j++){
                        if((wine_cellar[red_floor[i] * 5 + j] == -1) && (red_count_arr[min_floor] != 0)){
                            for(var k = 0; k < 5; k++){
                                if(wine_cellar[min_floor * 5 + k] != -1){
                                    wine_cellar[red_floor[i] * 5 + j] = wine_cellar[min_floor * 5 + k];
                                    wine_cellar[min_floor * 5 + k] == -1;
                                    red_count_arr[min_floor]--;
                                    jsonData.move_wine.push({
                                        "cur_row" : min_floor + 1,
                                        "cur_col" : k + 1,
                                        "next_row" : red_floor[i] + 1,
                                        "next_col" : j + 1
                                    })
                                    //min_floor층에 k번째 있던 것을 red_floor[i]층의 j번째로 옮기기
                                    //move_에 추가해주기, cell층 온도 바꿔주기
                                }
                            }
                        }
                    }
                }
            }
            
            cur_cellar_temp = [0, 0, 0];
            cur_cellar_count = [0, 0, 0];
            // 각 층 평균 온도와 와인 갯수 구하기
            for(var i = 0; i < 3; i++){
                for(var j = 0; j < 5; j++){
                    if(wine_cellar[i * 5 + j] != -1){
                        cur_cellar_count[i]++;
                        cur_cellar_temp[i] += wine_cellar[i * 5 + j];
                    }
                }
                if(cur_cellar_count[i] != 0){
                    cur_cellar_temp[i] = int(cur_cellar_temp[i] / cur_cellar_count[i]);
                }
            }

            if(jsonData.floor1.is_smart_mode == true){
                jsonData.floor1.temp_target = cur_cellar_temp[0];
            }
            if(jsonData.floor2.is_smart_mode == true){
                jsonData.floor2.temp_target = cur_cellar_temp[1];
            }
            if(jsonData.floor3.is_smart_mode == true){
                jsonData.floor3.temp_target = cur_cellar_temp[2];
            }
            
            jsonData.input_row = min_floor + 1;
            jsonData.input_col = 1;
            jsonData.msg.push("min_floor 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로 바꾸기, category도 inputwine으로 바꾸기8");
            jsonData.type = 2;

            if(min_floor == 0){
                jsonData.floor1.temp_target = input_wine_temp;
                jsonData.floor1.type = input_wine_category;
                jsonData.floor1.is_smart_mode = true;
            }
            else if(min_floor == 1){
                jsonData.floor2.temp_target = input_wine_temp;
                jsonData.floor2.type = input_wine_category;
                jsonData.floor2.is_smart_mode = true;
            }
            else if(min_floor == 2){
                jsonData.floor3.temp_target = input_wine_temp;
                jsonData.floor3.type = input_wine_category;
                jsonData.floor3.is_smart_mode = true;
            }

            return jsonData;
        }
        else if((white_count) <= (white_floor_count-1) * 5){
            //화이트 몰아주기
            for(var i = 0; i < white_floor.length; i++){
                if(temp_min > white_count_arr[white_floor[i]]){
                    min_floor = white_floor[i];
                }
            }
            
            //min_floor에 있는 레드 와인을 다른 레드와인 칸에 옮기기
            for(var i = 0; i < white_floor.length; i++){
                if(min_floor != white_floor[i]){
                    for(var j = 0; j < 5; j++){
                        if((wine_cellar[white_floor[i] * 5 + j] == -1) && (white_count_arr[min_floor] != 0)){
                            for(var k = 0; k < 5; k++){
                                if(wine_cellar[min_floor * 5 + k] != -1){
                                    wine_cellar[white_floor[i] * 5 + j] = wine_cellar[min_floor * 5 + k];
                                    wine_cellar[min_floor * 5 + k] == -1;
                                    white_count_arr[min_floor]--;
                                    jsonData.move_wine.push({
                                        "cur_row" : min_floor + 1,
                                        "cur_col" : k + 1,
                                        "next_row" : red_floor[i] + 1,
                                        "next_col" : j + 1
                                    })
                                    //min_floor층에 k번째 있던 것을 white_floor[i]층의 j번째로 옮기기
                                    //move_에 추가해주기, cell층 온도 바꿔주기
                                }
                            }
                        }
                    }
                }
            }

            cur_cellar_temp = [0, 0, 0];
            cur_cellar_count = [0, 0, 0];
            // 각 층 평균 온도와 와인 갯수 구하기
            for(var i = 0; i < 3; i++){
                for(var j = 0; j < 5; j++){
                    if(wine_cellar[i * 5 + j] != -1){
                        cur_cellar_count[i]++;
                        cur_cellar_temp[i] += wine_cellar[i * 5 + j];
                    }
                }
                if(cur_cellar_count[i] != 0){
                    cur_cellar_temp[i] = int(cur_cellar_temp[i] / cur_cellar_count[i]);
                }
            }

            if(jsonData.floor1.is_smart_mode == true){
                jsonData.floor1.temp_target = cur_cellar_temp[0];
            }
            if(jsonData.floor2.is_smart_mode == true){
                jsonData.floor2.temp_target = cur_cellar_temp[1];
            }
            if(jsonData.floor3.is_smart_mode == true){
                jsonData.floor3.temp_target = cur_cellar_temp[2];
            }

            
            jsonData.input_row = min_floor + 1;
            jsonData.input_col = 1;
            jsonData.msg.push("min_floor 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로 바꾸기, category도 inputwine으로 바꾸기8");
            jsonData.type = 2;

            if(min_floor == 0){
                jsonData.floor1.temp_target = input_wine_temp;
                jsonData.floor1.type = input_wine_category;
                jsonData.floor1.is_smart_mode = true;
            }
            else if(min_floor == 1){
                jsonData.floor2.temp_target = input_wine_temp;
                jsonData.floor2.type = input_wine_category;
                jsonData.floor2.is_smart_mode = true;
            }
            else if(min_floor == 2){
                jsonData.floor3.temp_target = input_wine_temp;
                jsonData.floor3.type = input_wine_category;
                jsonData.floor3.is_smart_mode = true;
            }

            return jsonData;
        }
        else if((spark_count) <= (spark_floor_count-1) * 5){
            //스파클링 몰아주기
            for(var i = 0; i < spark_floor.length; i++){
                if(temp_min > spark_count_arr[spark_floor[i]]){
                    min_floor = spark_floor[i];
                }
            }
            
            //min_floor에 있는 레드 와인을 다른 레드와인 칸에 옮기기
            for(var i = 0; i < spark_floor.length; i++){
                if(min_floor != spark_floor[i]){
                    for(var j = 0; j < 5; j++){
                        if((wine_cellar[spark_floor[i] * 5 + j] == -1) && (spark_count_arr[min_floor] != 0)){
                            for(var k = 0; k < 5; k++){
                                if(wine_cellar[min_floor * 5 + k] != -1){
                                    wine_cellar[spark_floor[i] * 5 + j] = wine_cellar[min_floor * 5 + k];
                                    wine_cellar[min_floor * 5 + k] == -1;
                                    spark_count_arr[min_floor]--;
                                    jsonData.move_wine.push({
                                        "cur_row" : min_floor + 1,
                                        "cur_col" : k + 1,
                                        "next_row" : red_floor[i] + 1,
                                        "next_col" : j + 1
                                    })
                                    //min_floor층에 k번째 있던 것을 spark_floor[i]층의 j번째로 옮기기
                                    //move_에 추가해주기, cell층 온도 바꿔주기
                                }
                            }
                        }
                    }
                }
            }

            cur_cellar_temp = [0, 0, 0];
            cur_cellar_count = [0, 0, 0];
            // 각 층 평균 온도와 와인 갯수 구하기
            for(var i = 0; i < 3; i++){
                for(var j = 0; j < 5; j++){
                    if(wine_cellar[i * 5 + j] != -1){
                        cur_cellar_count[i]++;
                        cur_cellar_temp[i] += wine_cellar[i * 5 + j];
                    }
                }
                if(cur_cellar_count[i] != 0){
                    cur_cellar_temp[i] = int(cur_cellar_temp[i] / cur_cellar_count[i]);
                }
            }

            if(jsonData.floor1.is_smart_mode == true){
                jsonData.floor1.temp_target = cur_cellar_temp[0];
            }
            if(jsonData.floor2.is_smart_mode == true){
                jsonData.floor2.temp_target = cur_cellar_temp[1];
            }
            if(jsonData.floor3.is_smart_mode == true){
                jsonData.floor3.temp_target = cur_cellar_temp[2];
            }

            
            jsonData.input_row = min_floor + 1;
            jsonData.input_col = 1;
            jsonData.msg.push("min_floor 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로 바꾸기, category도 inputwine으로 바꾸기8");
            jsonData.type = 2;

            if(min_floor == 0){
                jsonData.floor1.temp_target = input_wine_temp;
                jsonData.floor1.type = input_wine_category;
                jsonData.floor1.is_smart_mode = true;
            }
            else if(min_floor == 1){
                jsonData.floor2.temp_target = input_wine_temp;
                jsonData.floor2.type = input_wine_category;
                jsonData.floor2.is_smart_mode = true;
            }
            else if(min_floor == 2){
                jsonData.floor3.temp_target = input_wine_temp;
                jsonData.floor3.type = input_wine_category;
                jsonData.floor3.is_smart_mode = true;
            }

            return jsonData;
        }
        else{//몰아줄 놈이 없고, 빈 칸도 없음 -> 즉 user mode없으면 안됨

            var blank_and_user = [];

            for(var i = 0; i < 3; i++){
                if(is_smart_arr[i] == 0){
                    for(var j = 0; j < 5; j++){
                        if(wine_cellar[i * 5 + j] == -1){
                            blank_and_user.push(i);
                            break;
                        }
                    }
                }
            }

            if(blank_and_user.length == 0){
                jsonData.type = 0;
                jsonData.msg("Wine can not add!20")
                return jsonData;
            }

            cur_cellar_temp = [0, 0, 0];
            cur_cellar_count = [0, 0, 0];
            // 각 층 평균 온도와 와인 갯수 구하기
            for(var i = 0; i < 3; i++){
                for(var j = 0; j < 5; j++){
                    if(wine_cellar[i * 5 + j] != -1){
                        cur_cellar_count[i]++;
                        cur_cellar_temp[i] += wine_cellar[i * 5 + j];
                    }
                }
                if(cur_cellar_count[i] != 0){
                    cur_cellar_temp[i] = int(cur_cellar_temp[i] / cur_cellar_count[i]);
                }
            }
            
            var min_diff = 1000000;
            var min_diff_floor = -1;

            for(var i = 0; i < blank_and_user.length; i++){
                if(min_diff > Math.abs(cur_cellar_temp[blank_and_user[i]] - input_wine_temp)){
                    min_diff = Math.abs(cur_cellar_temp[blank_and_user[i]] - input_wine_temp);
                    min_diff_floor = blank_and_user[i];
                }
            }

            
            for(var j = 0; j < 5; j++){
                if(wine_cellar[min_diff_floor * 5 + j] == -1){
                    jsonData.input_row = min_diff_floor + 1;
                    jsonData.input_col = j + 1;
                    jsonData.msg.push("min_diff_floor번째 층 j번째 열에 와인 넣어주기");

                    return jsonData;
                }
            }

            jsonData.type = 0;
            jsonData.msg("Wine can not add!20")
            return jsonData;
        }
    }

    jsonData.type = 0;
    jsonData.msg("Wine can not add!15 end")
    return jsonData;
}