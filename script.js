

// ==== 定数 ====
const TOKEN_RATIO  = 1.5;
const TOKEN_RATIO2 = 2.0;
const MAX_PLAYER   = 5;
const MAX_VALUE    = 10;
const MIN_VALUE    = -10;
const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'WHITE', 'BLACK'];

// ==== グローバル変数 ====
var result = document.getElementById("result");
var player_num = 1;

// 値を上昇
function increase(id) {
    const trg = document.getElementById(id);
    var val = parseInt(trg.innerHTML);
    
    if(val >= MAX_VALUE){
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

    if(val <= MIN_VALUE){
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

    // プレイヤー人数を増加
    player_num += 1;

    // プレイヤーごとのをコピー
    var tmp = $("#player1").clone();

    // 表示名変更
    tmp.find(".player-num").text("プレイヤー" + String(player_num));

    // IDを変更
    tmp.attr('id', 'player' + String(player_num));
    txt = tmp.html();
    tmp.html(txt.replace(/player1/g, 'player'+String(player_num)));

    // 表示
    tmp.appendTo("#extra-players").hide().slideDown();

    if(player_num == MAX_PLAYER){
       document.getElementById("player-add-btn").disabled = true;
    }

}

function sub_player(){
    $("#player2").slideUp();
    $("#player2").remove();
    player_num -= 1;
}

function calc_score() {

    var val = 0;
    var num = 0;
    var tmp = 0;

    for (const color of colors) {

        val = Number(parseInt(document.getElementById(color).innerHTML));
        num = Number(parseInt(document.getElementById(color + "_hand_player2").innerHTML));

        if(document.getElementById(color + "_token1_player2").checked && document.getElementById(color + "_token2_plaery2").checked){

            tmp += parseInt(val * num * TOKEN_RATIO2, 10);

        }
        else if(document.getElementById(color + "_token1_player1").checked || document.getElementById(color + "_token2_player2").checked){
            tmp += parseInt(val * num * TOKEN_RATIO, 10);
        }
        else{
            tmp += val * num;
        }

        result.value = tmp;
        
    }

}
