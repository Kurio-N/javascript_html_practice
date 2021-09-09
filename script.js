
var result = document.getElementById("result");
const TOKEN_RATIO = 1.5;
const TOKEN_RATIO2 = 2.0;

function show(elem) {
    result.value = result.value + elem.value;
}
function increase(id) {
    var trg = document.getElementById(id)
    // trg.value = new Function("return 1+" + trg.value)();
    trg.value = parseInt(trg.value) + 1;
}
function decrease(id) {
    var trg = document.getElementById(id)
    trg.value = new Function("return " + trg.value + "-1")();
}
function increase2(id) {
    var trg = document.getElementById(id)
    // trg.value = new Function("return 1+" + trg.value)();
    trg.innerHTML = parseInt(trg.innerHTML) + 1;
}
function decrease2(id) {
    var trg = document.getElementById(id)
    trg.innerHTML = parseInt(trg.innerHTML) - 1;}


function calc_score() {
    const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'WHITE', 'BLACK'];
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
