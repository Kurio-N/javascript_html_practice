// ==== 定数 ====
const TOKEN_RATIO   = 1.5;
const TOKEN_RATIO2  = 2.0;
const MAX_PLAYER    = 5;
const MAX_VALUE     = 10;
const MIN_VALUE     = -10;
const MAX_COLOR_NUM = 16;
const MIN_COLOR_NUM = 0;
const MAX_TOKENS    = 4;
const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'WHITE', 'BLACK'];

// ==== クラス定義 ====
// プレイヤーコンポーネント
// ToDo 手札とトークンのHTML部分もこのクラスで管理する
class Player{
    constructor(player_id) {
        // 初期化
        this._player_id = player_id;
        this._prev_player_id = player_id;
        this.colors = {RED:0, BLUE:0, GREEN:0, YELLOW:0, WHITE:0, BLACK:0}
        this.tokens = {RED:[0, 0], BLUE:[0, 0], GREEN:[0, 0], YELLOW:[0, 0], WHITE:[0, 0], BLACK:[0, 0]}
        this.score  = 0;

        // HTMLを作成
        this.$result_html = jQuery("#result_playerX").clone(true);          
        var txt_res = this.$result_html.html();
        this.$result_html.attr('id', 'result_player' + String(player_id));
        this.$result_html.html(txt_res.replace(/playerX/g, 'player'+String(player_id)));
        this.$result_html.find("#name_player"+String(player_id)).text( "プレイヤー" + String(player_id) + " ");
        this.$result_html.removeClass("my-template");

    }

    set player_id(id){
        this._prev_player_id = this._player_id;
        this._player_id = id;
    }

    get player_id(){
        return this._player_id;

    }

    increase(color) {
        if (this.colors[color] < MAX_COLOR_NUM){
            this.colors[color] += 1;
        }
    }

    decrease(color) {
        if (this.colors[color] > MIN_COLOR_NUM){
            this.colors[color] -= 1;
        }
    }

    take_token(color, id) {
        if (id >= 1 && id < 3) {
            this.tokens[color][id-1] = 1;
        }
    }

    discard_token(color, id) {
        if (id >= 1 && id < 3) {
            this.tokens[color][id-1] = 0;
        }
    }

    toggle_token(color, id){
        if (id >= 1 && id < 3) {
            // 0 / 1 反転
            this.tokens[color][id-1] = this.tokens[color][id-1] * -1 + 1 ;
        }
    }

    calc_score(color_values) {

        var tmp = 0;

        for (const color of colors) {

            var val = color_values[color];
            var num = this.colors[color]
            var ratio = 1.0

            if(this.tokens[color][0] == 1 && this.tokens[color][1] == 1 ){
                ratio = TOKEN_RATIO2;
            }
            else if(this.tokens[color][0] == 1 || this.tokens[color][1] == 1 ){
                ratio = TOKEN_RATIO;
            }

            tmp += parseInt(val * num * ratio, 10);
        }

        this.score = tmp;

        return this.score;
    }

    update_html(){
        // Player_IDを反映
        if (this._prev_player_id == this._player_id){
            this.$result_html.find(".player-num").text("プレイヤー" + String(this._player_id));
            this.$result_html.attr('id', 'result_player' + String(this._player_id));
            var txt_res = this.$result_html.html();
            this.$result_html.html(txt_res.replace(new RegExp("player"+String(this._prev_player_id),'g'), 'player'+String(this._player_id)));
            // 更新したのでprev_player_idを更新しておく
            this._prev_player_id = this._player_id;
        }

        // トークンの取得状況を更新
        var token_id = 1;
        for (const color of colors) {
            if(this.tokens[color][0] == 1 && this.tokens[color][1] == 1 ){

                if(token_id <= MAX_TOKENS){
                    this.$result_html.find("#token" + String(token_id) + "_player" + String(this._player_id)).removeClass().addClass("shoes shoes-"+color);
                    token_id += 1;
                }

                if(token_id <= MAX_TOKENS){
                    this.$result_html.find("#token" + String(token_id) + "_player" + String(this._player_id)).removeClass().addClass("shoes shoes-"+color);
                    token_id += 1;
                }

            }
            else if(this.tokens[color][0] == 1 || this.tokens[color][1] == 1 ){
                if(token_id <= MAX_TOKENS){
                    this.$result_html.find("#token" + String(token_id) + "_player" + String(this._player_id)).removeClass().addClass("shoes shoes-"+color);
                    token_id += 1;
                }
            }

            if(token_id > MAX_TOKENS){
                break;
            }
        }
        // 余ったトークンは非表示
        for (let i = token_id;i <= MAX_TOKENS; i++){
            this.$result_html.find("#token" + String(token_id) + "_player" + String(this._player_id)).removeClass().addClass("shoes shoes-NONE");
        }

        // 点数表示を更新
        this.$result_html.find("#score_player" + String(this._player_id)).text = String(this.score) + "点";

        // エラーの状況を更新
    }

}

class Players{
    constructor(){

        //  初期化
        this.player_num           = 1;
        this.players              = [new Player(1)];
        this.$default_result_html = jQuery("#result").clone();
        // this.$default_result_html = document.getElementById
        this.$result_html         = this.$default_result_html.clone();
    }

    add_player(){
     
        if (this.player_num < MAX_PLAYER){
            // 人数を更新
            this.player_num += 1;
            // リストにPlayerインスタンスを追加
            this.players.push(new Player(this.player_num));
        
        }
    }

    sub_player(player_id){

        if (this.player_num > 1){

            this.player_num -= 1;
            this.players.splice(player_id-1, 1);
            // player ID をずらしていく
            for(let i = player_id-1; i <= this.player_num-1; i++){
            
                this.players[i].player_id = i+1;
            
            }
        }
    }

    get_player_by_id(player_id){

        return this.players[player_id-1];

    }

    update_html(){

        // リセット
        this.$result_html = this.$default_result_html.clone();

        // プレイヤーを一人ずつ更新して追加
        for(let i = 0; i < this.players.length; i++){

            this.players[i].update_html();
            this.$result_html.append(this.players[i].$result_html)
        }


        return this.$result_html;

    }

    calc_score(color_values){

        // 各プレイヤーで得点計算を実行
        for(let i = 0; i < this.players.length; i++){
            this.players[i].calc_score(color_values);
        }

    }
}

// ==== グローバル変数 ====
var player_num = 1;
var players = new Players();

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// ==== HTMLから呼び出される関数 ====

// 値を上昇
function increase_color(id) {
    const trg = document.getElementById(id);
    var val = parseInt(trg.innerHTML);
    
    if(val >= MAX_VALUE){
        trg.innerHTML = val;
    }
    else{
        trg.innerHTML = val + 1;
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")
    }

}
// 値を減少
function decrease_color(id) {
    const trg = document.getElementById(id);
    var val = parseInt(trg.innerHTML)

    if(val <= MIN_VALUE){
        trg.innerHTML = val;
    }
    else{
        trg.innerHTML = val - 1;
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")
    }
}

// 手札
// 上昇
function increase_hand(id) {
    const trg = document.getElementById(id);
    var val = parseInt(trg.innerHTML);
    
    if(val >= MAX_COLOR_NUM){
        trg.innerHTML = val;
    }
    else{
        trg.innerHTML = val + 1;
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")
    }

}
// 減少
function decrease_hand(id) {
    const trg = document.getElementById(id);
    var val = parseInt(trg.innerHTML)

    if(val <= MIN_COLOR_NUM){
        trg.innerHTML = val;
    }
    else{
        trg.innerHTML = val - 1;
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")
    }
}


// 得点計算画面に反映させる
function apply(id1, id2){
    var trg1 = document.getElementById(id1);
    var trg2 = document.getElementById(id2);

    trg2.innerHTML = trg1.innerHTML;
}

// 結果のトークンの色を変える
function set_token_color(i, p, color){

    $("#token" + String(i) + "_player" + String(p)).removeClass().addClass("shoes shoes-"+color);

}


// プレイヤーを追加
function add_player(){

    if (player_num <= MAX_PLAYER){

        // プレイヤー人数を増加
        player_num += 1;

        // プレイヤー数が最大値になったら追加ボタンをdisable
        if(player_num == MAX_PLAYER){
            document.getElementById("player-add-btn").disabled = true;
        }
    
        // プレイヤー数が2以上になったらプレイヤー削除ボタンをenable
        if(player_num > 1){
            document.getElementById("player1-sub-btn").disabled = false;
        }

        // プレイヤーごとのをコピー
        var tmp = $("#player1").clone(true);

        // 表示名変更
        tmp.find(".player-num").text("プレイヤー" + String(player_num));

        // IDを変更
        tmp.attr('id', 'player' + String(player_num));
        txt = tmp.html();
        tmp.html(txt.replace(/player1/g, 'player'+String(player_num)));

        // 表示
        tmp.appendTo("#players").hide().slideDown();

        // // 結果部分にもプレイヤーを追加
        // var tmp_res = $("#result_playerX").clone();

        // // 表示名・ID変更
        // txt_res = tmp_res.html();
        // tmp_res.attr('id', 'result_player' + String(player_num));
        // tmp_res.html(txt_res.replace(/playerX/g, 'player'+String(player_num)));
        // tmp_res.find("#name_player"+String(player_num)).text( "プレイヤー" + String(player_num) + " ")
        // tmp_res.removeClass("my-template")

        // tmp_res.appendTo("#result")

        players.add_player();

        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")

    }

}

// Player Hand 部分のIDを書き換える
function change_player_id(id_num_from, id_num_to){

    var player_from = $("#player" + String(id_num_from))

    // 表示名書き換え
    player_from.find(".player-num").text("プレイヤー" + String(id_num_to))

    // IDをすべて書き換え
    player_from.attr('id', 'player' + String(id_num_to));
    console.log(player_from.attr("id"))
    txt = player_from.html();
    player_from.html(txt.replace(/player\d/g, 'player'+String(id_num_to)));

}

function sub_player(player_id){

    // プレイヤーが1人だけの場合は何も起きない
    if(player_num > 1){


        // そのプレイヤーを削除
        $("#" + player_id).slideUp("normal", function(){
            $(this).remove();
        });

        // 数値を管理してるオブジェクトも更新
        id_num = parseInt(player_id.replace("player", ""))
        players.sub_player(id_num)

        // そのプレイヤーより後ろのプレイヤーを１つずつ下にスライド
        // ToDo この処理が完了してからenable disableの処理を実行する
        for (let i = id_num; i < player_num; i++){
            change_player_id(i+1, i);
        }

        // プレイヤー数を減少
        player_num -= 1;

        // チェックボックスの状況を反映する
        for (let i = id_num; i < player_num; i++){

            for (const color in colors){

                if (players.get_player_by_id(i).tokens[color][0] == 1){
                    document.getElementById(color + "_token1_" + "player" + String(i)).checked = true;
                }
                if (players.get_player_by_id(i).tokens[color][1] == 1){
                    document.getElementById(color + "_token2_" + "player" + String(i)).checked = true;
                }

            }

        }


        // プレイヤー数が最大値でなくなったらプレイヤー追加ボタンをenable
        if(player_num < MAX_PLAYER){
            document.getElementById("player-add-btn").disabled = false;
         }

        // プレイヤー数が一人になったら削除ボタンをdisabledに
        if (player_num == 1){
            document.getElementById("player1-sub-btn").disabled = true;
        }

        // 状況をアップデート
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")
    }

}

function calc_score() {

    // var val = 0;
    // var num = 0;
    // var tmp = 0;
    // var token_ind = 1;
    // var player = "";

    // for (let p = 1; p <= player_num; p++){

    //     player = "player" + String(p);
    //     tmp = 0;
    //     for (let j = 1; j <= 4;j++){
    //         set_token_color(j, p, "NONE");
    //     }
    //     token_ind = 1;

    //     for (const color of colors) {

    //         val = Number(parseInt(document.getElementById(color).innerHTML));
    //         console.log(val)
    //         num = Number(parseInt(document.getElementById(color + "_hand_" + player).innerHTML))
    //         console.log(num)
    //         if(document.getElementById(color + "_token1_" + player).checked && document.getElementById(color + "_token2_" + player).checked){
    
    //             tmp += parseInt(val * num * TOKEN_RATIO2, 10);
                
    //             if (token_ind <= 4){
    //                 set_token_color(token_ind++, p, color);
    //             }
    //             if (token_ind <= 4){
    //                 set_token_color(token_ind++, p, color);
    //             }
    
    //         }
    //         else if(document.getElementById(color + "_token1_" + player).checked || document.getElementById(color + "_token2_" + player).checked){
    //             console.log("OK")
    //             tmp += parseInt(val * num * TOKEN_RATIO, 10);
    //             if (token_ind <= 4){
    //                 set_token_color(token_ind++, p, color);
    //             }
    //         }
    //         else{
    //             tmp += val * num;
    //         }
            
    //     }

    //     document.getElementById("score_"+player).innerHTML = String(tmp) + "点";
    // }

    var color_values = {RED:0, BLUE:0, GREEN:0, YELLOW:0, WHITE:0, BLACK:0};
    for (const color of colors) {

        color_values[color] = Number(parseInt(document.getElementById(color).innerHTML));
    }

    players.calc_score(color_values);
    players.update_html();

    $("#result").html(players.$result_html.html())
    $("#result").show()
    document.getElementById("btn-calc").disabled = true;
    $("#result").removeClass("grayout")

    tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    

}

$(function(){

    // チェックボックスが押された場合
    $("#players").on("click", ".check-btns > input",  function(){

        args = $(this).attr('id').split('_')

        var player_id = parseInt(args[2].replace("player", ""));
        var color     = args[0];
        var token_id  = parseInt(args[1].replace("token", ""));

        console.log(player_id)
        console.log(color)
        console.log(token_id)
        console.log(players.player_num)

        players.get_player_by_id(player_id).toggle_token(color, token_id);

        // 状況をアップデート
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")

    });

});
