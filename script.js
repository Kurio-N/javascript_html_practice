// ==== ToDos ====
// * 手札のテンプレートを用意して、Player1ではなくテンプレートからコピーする
// * エラーの検出機能を実装
// * エラーマークの表示を微調整
// * プレイヤー削除ボタンを押したらmodal表示
// * スマホ用にフォントや隙間を調整
// * 計算ボタンを押したら最下部に自動で移動
// * 手札のHTMLもオブジェクトで管理する
// * プレイヤーを追加したらそこに追従


// ==== 定数 ====
const TOKEN_RATIO    = 1.5;
const TOKEN_RATIO2   = 2.0;
const MAX_PLAYER     = 5;
const MAX_VALUE      = 10;
const MIN_VALUE      = -10;
const MAX_COLOR_NUM  = 16;
const MIN_COLOR_NUM  = 0;
const MAX_TOKENS     = 4;
const FINAL_HANDS    = 4;
const COLOR_PER_CARD = 2;
const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'WHITE', 'BLACK'];

// ==== クラス定義 ====
// プレイヤーコンポーネント
// ToDo 手札とトークンのHTML部分もこのクラスで管理する
class Player{

    constructor(player_id) {

        // 定数的な物
        this.ALERT = ["トークンの数が多すぎます", "色の個数が多すぎます", "トークンの数が多すぎます<br>色の個数が多すぎます"]

        // 初期化
        this._player_id = player_id;
        this._prev_player_id = player_id;
        this.colors = {RED:0, BLUE:0, GREEN:0, YELLOW:0, WHITE:0, BLACK:0}
        this.tokens = {RED:[0, 0], BLUE:[0, 0], GREEN:[0, 0], YELLOW:[0, 0], WHITE:[0, 0], BLACK:[0, 0]}
        this.score  = 0;

        // HTMLのひな形を作成
        this.$result_html = jQuery("#result_playerX").clone(true);          
        var txt_res = this.$result_html.html();
        this.$result_html.attr('id', 'result_player' + String(player_id));
        this.$result_html.html(txt_res.replace(/playerX/g, 'player'+String(player_id)));
        this.$result_html.find(".player_name").text( "プレイヤー" + String(player_id) + " ");
        this.$result_html.removeClass("my-template");

    }

    set player_id(id){
        this._prev_player_id = this._player_id;
        this._player_id = id;

        // Player_IDをHTMLに反映しておく
        if (this._prev_player_id != this._player_id){
            this.$result_html.find(".player_name").text("プレイヤー" + String(this._player_id));
            this.$result_html.attr('id', 'result_player' + String(this._player_id));
            var txt_res = this.$result_html.html();
            this.$result_html.html(txt_res.replace(new RegExp("player"+String(this._prev_player_id),'g'), 'player'+String(this._player_id)));
        }

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

    get token_num(){

        var sum = 0;

        for (const color of COLORS){
            sum += this.tokens[color][0] + this.tokens[color][1];
        }

        return sum;
    }

    get color_num(){

        var sum = 0;
        for (const color of COLORS){

            sum += this.colors[color]
        }

        return sum;

    }

    calc_score(color_values) {

        var tmp = 0;

        for (const color of COLORS) {

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

        // // Player_IDを反映
        // if (this._prev_player_id != this._player_id){
        //     this.$result_html.find(".player_name").text("プレイヤー" + String(this._player_id));
        //     this.$result_html.attr('id', 'result_player' + String(this._player_id));
        //     var txt_res = this.$result_html.html();
        //     this.$result_html.html(txt_res.replace(new RegExp("player"+String(this._prev_player_id),'g'), 'player'+String(this._player_id)));
        //     // 更新したのでprev_player_idを更新しておく
        //     this._prev_player_id = this._player_id;
        // }

        // トークンの取得状況を更新
        var token_id = 1;
        for (const color of COLORS) {
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
        this.$result_html.find("#score_player" + String(this._player_id)).text(String(this.score) + "点");

        // アラートの状況を更新
        // トークンの数を判定
        var alert_code = 1 * (this.token_num > MAX_TOKENS) + 2 * (this.color_num > COLOR_PER_CARD * FINAL_HANDS) -1;
        if(alert_code >= 0){
            this.$result_html.find(".alert").prop("title", this.ALERT[alert_code]);
            this.$result_html.find(".alert-svg").removeClass("my-template")
        }
        else{
            this.$result_html.find(".alert-svg").addClass("my-template")
        }


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
            $(".player-sub-btn").prop('disabled', false);
        }

        // プレイヤーごとのをコピー
        var tmp = $("#playerX").clone(true);

        // 表示名変更
        tmp.find(".player-num").text("プレイヤー" + String(player_num));

        // IDを変更
        tmp.attr('id', 'player' + String(player_num));
        txt = tmp.html();
        tmp.html(txt.replace(/playerX/g, 'player'+String(player_num)));
        // my-template を削除
        tmp.removeClass("my-template")

        // 表示
        tmp.appendTo("#players").hide().slideDown();

        // playersと結果部分にも反映
        players.add_player();

        // 状況が更新されたので計算ボタンを解放・現在の結果をグレイアウト
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")

    }

}

// Player Hand 部分のIDを書き換える
function change_player_id(id_num_from, id_num_to){

    var $player_from = $("#player" + String(id_num_from))

    // 表示名書き換え
    $player_from.find(".player-num").text("プレイヤー" + String(id_num_to))

    // IDをすべて書き換え
    $player_from.attr('id', "player"+String(id_num_to))
    $player_from.find('div[id], button[id], input[id]').each(function(i, e){
        var pre_id = $(e).attr('id');
        $(e).attr('id', pre_id.replace("player"+String(id_num_from), "player"+String(id_num_to)));
    });
    // ラベルのforの部分も書き換え
    $player_from.find("label[for]").each(function(i, e){
        var pre_for = $(e).attr('for');
        $(e).attr('for', pre_for.replace("player"+String(id_num_from), "player"+String(id_num_to)));
    });

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

        // プレイヤー数が最大値でなくなったらプレイヤー追加ボタンをenable
        if(player_num < MAX_PLAYER){
            document.getElementById("player-add-btn").disabled = false;
         }

        // プレイヤー数が一人になったら削除ボタンをdisabledに
        if (player_num == 1){
            // document.getElementById("player1-sub-btn").disabled = true;
            $(".player-sub-btn").prop('disabled', true);
        }

        // 状況をアップデート
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")
    }

}

function calc_score() {

    var color_values = {RED:0, BLUE:0, GREEN:0, YELLOW:0, WHITE:0, BLACK:0};
    for (const color of COLORS) {

        color_values[color] = Number(parseInt(document.getElementById(color).innerHTML));
    }

    players.calc_score(color_values);
    players.update_html();

    $("#result").html(players.$result_html.html())
    $("#result").show()
    document.getElementById("btn-calc").disabled = true;
    $("#result").removeClass("grayout")

    // tooltipリストを更新
    tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    

}

// ===== jQueryによるイベント管理 ====
$(function(){

    // チェックボックスが押された場合
    $("#players").on("click", ".check-btns > input",  function(){

        args = $(this).attr('id').split('_')

        var player_id = parseInt(args[2].replace("player", ""));
        var color     = args[0];
        var token_id  = parseInt(args[1].replace("token", ""));

        players.get_player_by_id(player_id).toggle_token(color, token_id);

        // 状況をアップデート
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout")

    });

    // プレイヤー削除ボタン
    $("#players").on("click", ".player-sub-btn", function(){

        var args = $(this).attr('id').split('-');
        sub_player(args[0]);

        // // プレイヤー数が一人になったら削除ボタンをdisabledに
        // if (player_num == 1){
        //     document.getElementById("player1-sub-btn").disabled = true;
        // }
    });

    // 色の個数上昇
    $("#players").on("click", ".plus", function(){
        var args = $(this).attr('id').split('_');
        var player_id = parseInt(args[2].replace("player", ""));
        var color     = args[0];

        // 値を上昇
        players.get_player_by_id(player_id).increase(color);
        // HTML書き換え
        $("#"+args[0] + "_hand_" + args[2]).text(String(players.get_player_by_id(player_id).colors[color]));
        // 値が変わったら計算ボタン有効化・結果表示をグレイアウト
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout");
    });

    // 色の個数減少
    $("#players").on("click", ".minus", function(){
        var args = $(this).attr('id').split('_');
        var player_id = parseInt(args[2].replace("player", ""));
        var color     = args[0];

        // 値を上昇
        players.get_player_by_id(player_id).decrease(color);
        // HTML書き換え
        $("#"+args[0] + "_hand_" + args[2]).text(String(players.get_player_by_id(player_id).colors[color]));
        // 値が変わったら計算ボタン有効化・結果表示をグレイアウト
        document.getElementById("btn-calc").disabled = false;
        $("#result").addClass("grayout");
    });

});
