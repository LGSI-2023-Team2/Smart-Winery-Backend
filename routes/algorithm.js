
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
            {
                "cur_row": 1,
                "cur_col": 1,
                "next_row": 2,
                "next_col": 3
            }
        ]
    };
    var wine_cellar = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    var is_smart_arr = [1, 1, 0];
    var wine_categories = [3, 2, 3];
    
    jsonData.floor1.temp_target = cellar_json.floor1.temp_target;
    jsonData.floor2.temp_target = cellar_json.floor2.temp_target;
    jsonData.floor3.temp_target = cellar_json.floor3.temp_target;

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
        wine_cellar[(element.row - 1) * 5 + element.col - 1] = element.temp
    });

    cellar_json.floor2.cell_ids.forEach(element => {
        wine_cellar[(element.row - 1) * 5 + element.col - 1] = element.temp
    });

    cellar_json.floor3.cell_ids.forEach(element => {
        wine_cellar[(element.row - 1) * 5 + element.col - 1] = element.temp
    });

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

    for(var i = 0; i < 15; i++){
        if(wine_cellar[i] == -1){
            empty_check = 1;
        }
    }

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
        console.log(cur_cellar_temp[i]);
    }

    // input와인과 같은 카테고리인 층 중 빈칸 찾기
    empty_check = 0;
    cate_check = 0;
    for(var i = 0; i < 3; i++){
        if(wine_categories[i] == input_wine_category){
            for(var j = 0; j < 5; j++){
                if(wine_cellar[i*5 + j] == -1){
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
        console.log("bo");
        if(same_cate_arr.length != 0){
            //같은 카테고리가 있고 그 칸이 비었을때 칸들 중 가장 좋은 칸 찾아주기
            for(var i = 0; i < same_cate_arr.length; i++){
                if(diff > Math.abs(cur_cellar_temp[same_cate_arr[i]] - input_wine_temp)){
                    diff = Math.abs(cur_cellar_temp[same_cate_arr[i]] - input_wine_temp);
                    input_wine_floor = i;
                }
            }
        
            for(var i = 0; i < 5; i++){
                if(wine_cellar[input_wine_floor * 5 + i] == -1){
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
            //같은 카테고리가 있기는 한데 그 칸들이 모두 차있는 경우
            for(var i = 0; i < 3; i++){
                if(is_smart_arr[i] == 0){ // 스마트 모드가 꺼진 칸에서
                    if(cur_cellar_count[i] != 5){ // 그 칸에서 빈 것이 있는 경우
                        for(var j = 0; j < 5; j++){ 
                            if(wine_cellar[i * 5 + j] == -1){
                                next_temp = int((cur_cellar_temp[i] * cur_cellar_count[i] + input_wine_temp) / (cur_cellar_count[i] + 1));
                                jsonData.input_row = i + 1;
                                jsonData.input_col = j + 1;
                                jsonData.msg.push("2번 옮기기");
                                jsonData.type = 1;
                                if(i == 0){
                                    jsonData.floor1.temp_target = next_temp;
                                }
                                else if(i == 1){
                                    jsonData.floor2.temp_target = next_temp;
                                }
                                else if(i == 2){
                                    jsonData.floor3.temp_target = next_temp;
                                }
                                return jsonData;
                            }
                        }
                    }
                }
            }
            for(var i = 0; i < 3; i++){
                if(cur_cellar_count[i] == 0){ // 어떤 비어있는 칸이 있는 경우
                    jsonData.input_row = i + 1;
                    jsonData.input_col = 1;
                    jsonData.msg.push("i 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로5");
                    jsonData.type = 1;
                    if(i == 0){
                        jsonData.floor1.temp_target = input_wine_temp;
                    }
                    else if(i == 1){
                        jsonData.floor2.temp_target = input_wine_temp;
                    }
                    else if(i == 2){
                        jsonData.floor3.temp_target = input_wine_temp;
                    }
                    return jsonData;
                }
            }

            for(var i = 0; i < 3; i++){
                if(wine_categories[i] != input_wine_category){
                    not_this_cate.push(i);
                }
            }

            if(not_this_cate.length == 1){
                if(cur_cellar_count[not_this_cate[0]] == 0){
                    jsonData.input_row = not_this_cate[0] + 1;
                    jsonData.input_col = 1;
                    jsonData.msg.push("not_this_cate[0] 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로5");
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
                            next_temp = int((cur_cellar_temp[not_this_cate[0]] * cur_cellar_count[not_this_cate[0]] + input_wine_temp) / (cur_cellar_count[not_this_cate[0]] + 1));
                            jsonData.input_row = not_this_cate[0] + 1;
                            jsonData.input_col = j + 1;
                            jsonData.msg.push("not_this_cate[0] 층에 j번째에 해당 와인 넣기, 그 층의 온도는 next_temp로 바꾸기7");
                            jsonData.type = 1;
                            if(not_this_cate[0] == 0){
                                jsonData.floor1.temp_target = next_temp;
                            }
                            else if(not_this_cate[0] == 1){
                                jsonData.floor2.temp_target = next_temp;
                            }
                            else if(not_this_cate[0] == 2){
                                jsonData.floor3.temp_target = next_temp;
                            }

                            return jsonData;
                        }
                    }
                }
            }
            else{
                for(var i = 0; i < not_this_cate.length; i++){
                    if(cur_cellar_count[not_this_cate[i]] == 0){
                        jsonData.input_row = not_this_cate[0] + 1;
                        jsonData.input_col = 1;
                        jsonData.msg.push("not_this_cate[0] 층에 1번째에 해당 와인 넣기, 그 층의 온도는 input_wine_temp로 바꾸기, category도 inputwine으로 바꾸기8");
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
                }
                if((is_smart_arr[not_this_cate[0]] == 1) && (is_smart_arr[not_this_cate[1]] == 1)){
                    if(wine_categories[not_this_cate[0]] == wine_categories[not_this_cate[1]]){
                        if((cur_cellar_count[not_this_cate[0]] + cur_cellar_count[not_this_cate[1]]) <= 5){
                            if(cur_cellar_count[not_this_cate[0]] >= cur_cellar_count[not_this_cate[1]]){
                                return "not_this_cate[1]번 열에 있는 것들을 다 not_this_cate[0]열로 넣어주고, not_this_cate[1] 층에 1번째에 와인 넣고, 그 층의 온도는 input_wine_temp로 바꿔주고, category도 input으로 바꿔주기9";
                            }
                            else{
                                return "not_this_cate[0]번 열에 있는 것들을 다 not_this_cate[1]열로 넣어주고, not_this_cate[0] 층에 1번째에 와인 넣고, 그 층의 온도는 input_wine_temp로 바꿔주고, category도 input으로 바꿔주기10";
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
                        return "not_this_cate[0] 줄에 넣으셈, 온도 바꿔야됨14";
                    }
                }
                else if((is_smart_arr[not_this_cate[0]] == 1) && (is_smart_arr[not_this_cate[1]] == 0)){
                    if(cur_cellar_count[not_this_cate[1]] == 5){
                        jsonData.type = 0;
                        jsonData.msg("Wine can not add!15")
                        return jsonData;
                    }
                    else{
                        return "not_this_cate[1] 줄에 넣으셈, 온도 바꿔야됨16";
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
                                    return (not_this_cate[1]+1) +  "층에" + (k+1) +"번째에 해당 와인 넣기, 그 층의 온도는" +  next_temp+ "로 바꾸기17"
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
                            next_temp = int((cur_cellar_temp[not_this_cate[0]] * cur_cellar_count[not_this_cate[0]] + input_wine_temp) / (cur_cellar_count[not_this_cate[0]] + 1));
                            for(var k = 0; k < 5; k++){
                                if(wine_cellar[not_this_cate[0] * 5 + k] == -1){
                                    empty_space = not_this_cate[0] * 5 + k;
                                    break;
                                }
                            }
                            return (not_this_cate[0]+1) +  "층에" + (empty_space+1) +"번째에 해당 와인 넣기, 그 층의 온도는" +  next_temp+ "로 바꾸기17"
                        }
                        else{
                            next_temp = int((cur_cellar_temp[not_this_cate[1]] * cur_cellar_count[not_this_cate[1]] + input_wine_temp) / (cur_cellar_count[not_this_cate[1]] + 1));
                            for(var k = 0; k < 5; k++){
                                if(wine_cellar[not_this_cate[1] * 5 + k] == -1){
                                    empty_space = not_this_cate[1] * 5 + k;
                                    break;
                                }
                            }
                            return (not_this_cate[1]+1) +  "층에" + (empty_space+1) +"번째에 해당 와인 넣기, 그 층의 온도는" +  next_temp+ "로 바꾸기17"
                        }
                    }
                }
            }

        }
    }
    else{ // 같은 카테고리가 없는 경우

        for(var i = 0; i < 3; i++){
            if(cur_cellar_count[i] == 0){//빈 층이 있는 경우
                return "i층 1번째 input wine으로 바꾸고, 온도도 input, 카테고리도 input, smart mode도 켜주기18"
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
                                    //min_floor층에 k번째 있던 것을 red_floor[i]층의 j번째로 옮기기
                                    //move_에 추가해주기, cell층 온도 바꿔주기
                                }
                            }
                        }
                    }
                }
            }

            return "min_floor를 input의 와인 온도로 바꿔주고, min_floor의 1번에 와인 넣어주기"
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
                                    //min_floor층에 k번째 있던 것을 white_floor[i]층의 j번째로 옮기기
                                    //move_에 추가해주기, cell층 온도 바꿔주기
                                }
                            }
                        }
                    }
                }
            }

            return "min_floor를 input의 와인 온도로 바꿔주고, min_floor의 1번에 와인 넣어주기"
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
                                    //min_floor층에 k번째 있던 것을 spark_floor[i]층의 j번째로 옮기기
                                    //move_에 추가해주기, cell층 온도 바꿔주기
                                }
                            }
                        }
                    }
                }
            }

            return "min_floor를 input의 와인 온도로 바꿔주고, min_floor의 1번에 와인 넣어주기"
        }
        else{//몰아줄 놈이 없고, 빈 칸도 없음 -> 즉 user mode없으면 안됨
            for(var i = 0; i < 3; i++){
                if(is_smart_arr[i] == 0){
                    for(var j = 0; j < 5; j++){
                        if(wine_cellar[i * 5 + j] == -1){
                            return "i번째 층 j번째 열에 그 와인 넣어주고 평균 온도 맞춰주기22"
                        }
                    }
                }
            }

            return "넣을 칸 없어23"
        }
    }
}

console.log(wineAlgorithm())