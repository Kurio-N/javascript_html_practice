

// ==== 定数 ====
const TOKEN_RATIO = 1.5;
const TOKEN_RATIO2 = 2.0;
const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'WHITE', 'BLACK'];

// ==== グローバル変数 ====
var result = document.getElementById("result");
var player_num = 1;

// 値を上昇
function increase(id) {
    const trg = document.getElementById(id);
    var val = parseInt(trg.innerHTML);
    
    if(val >= 10){
        trg.innerHTML = val;
    }
    else{
        trg.innerHTML = val + 1;
    }

}
// 値を減少
function decrease(id) {
    const trg = document.getElementById(id);
    var val = parseInt(trg.innerHTML)

    if(val <= -10){
        trg.innerHTML = val;
    }
    else{
        trg.innerHTML = val - 1;
    }
}

// 得点計算画面に反映させる
function apply(id1, id2){
    var trg1 = document.getElementById(id1);
    var trg2 = document.getElementById(id2);

    trg2.innerHTML = trg1.innerHTML;
}

// ===== jQueryに依存した関数 =====
function add_player(){

    // プレイヤーごとのをコピー
    var tmp = $("#player1").clone()
   
    // プレイヤー人数を増加
    player_num += 1;

    // 表示名変更
    tmp.find(".player-num").text("プレイヤー" + String(player_num))

    // IDを変更
    txt = tmp.html()
    tmp.html(txt.replace(/player1/g, 'player'+String(player_num)))

    // 表示
    tmp.appendTo("#extra-players").hide().slideDown();
    
}

function sub_player(){
    
}

function calc_score() {

    var val = 0;
    var num = 0;
    var tmp = 0;

    for (const color of colors) {

        val = Number(parseInt(document.getElementById(color).innerHTML));
        num = Number(parseInt(document.getElementById(color + "_hand_player1").innerHTML));

        if(document.getElementById(color + "_token1_player1").checked && document.getElementById(color + "_token2_plaery1").checked){

            tmp += parseInt(val * num * TOKEN_RATIO2, 10)

        }
        else if(document.getElementById(color + "_token1_player1").checked || document.getElementById(color + "_token2_player1").checked){
            tmp += parseInt(val * num * TOKEN_RATIO, 10)
        }
        else{
            tmp += val * num
        }

        result.value = tmp;
        
    }

}
