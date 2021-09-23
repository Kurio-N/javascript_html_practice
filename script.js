
var result = document.getElementById("result");
const TOKEN_RATIO = 1.5;
const TOKEN_RATIO2 = 2.0;
const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'WHITE', 'BLACK'];

function increase(id) {
    var trg = document.getElementById(id);
    // trg.value = new Function("return 1+" + trg.value)();
    trg.value = parseInt(trg.value) + 1;
}
function decrease(id) {
    var trg = document.getElementById(id);
    trg.value = new Function("return " + trg.value + "-1")();
}
function increase2(id) {
    var trg = document.getElementById(id);
    // trg.value = new Function("return 1+" + trg.value)();
    trg.innerHTML = parseInt(trg.innerHTML) + 1;
}
function decrease2(id) {
    var trg = document.getElementById(id);
    trg.innerHTML = parseInt(trg.innerHTML) - 1;
}

// 得点計算画面に反映させる
function apply(id1, id2){
    var trg1 = document.getElementById(id1);
    var trg2 = document.getElementById(id2);

    trg2.innerHTML = trg1.innerHTML;
}



function calc_score() {

    var val = 0;
    var num = 0;
    var tmp = 0;

    for (const color of colors) {

        val = Number(parseInt(document.getElementById(color).innerHTML));
        num = Number(document.getElementById(color + "_hand").value)

        if(document.getElementById(color + "_token").checked && document.getElementById(color + "_token2").checked){

            tmp += parseInt(val * num * TOKEN_RATIO2, 10)

        }
        else if(document.getElementById(color + "_token").checked || document.getElementById(color + "_token2").checked){
            tmp += parseInt(val * num * TOKEN_RATIO, 10)
        }
        else{
            tmp += val * num
        }

        result.value = tmp;
        
    }

}
