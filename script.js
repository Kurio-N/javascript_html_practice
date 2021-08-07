
var result = document.getElementById("result");
const TOKEN_RATIO = 1.5;

function show(elem) {
    result.value = result.value + elem.value;
}
function increase(id) {
    var trg = document.getElementById(id)
    trg.value = new Function("return 1+" + trg.value)();
}
function decrease(id) {
    var trg = document.getElementById(id)
    trg.value = new Function("return " + trg.value + "-1")();
}
function del() {
    result.value = '';
}
function calc_score() {
    const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'WHITE', 'BLACK'];
    var val = 0;
    var num = 0;
    var tmp = 0;

    for (const color of colors) {

        val = Number(document.getElementById(color).value);
        num = Number(document.getElementById(color + "_hand").value)

        if(document.getElementById(color + "_token").checked){

            tmp += parseInt(val * num * TOKEN_RATIO, 10)

        }
        else{
            tmp += val * num
        }

        result.value = tmp;
        
    }

}
