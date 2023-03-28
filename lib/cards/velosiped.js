function alignRight(idWhat, idTo){
    var what = document.getElementById(idWhat);
    var to = document.getElementById(idTo);
    var xTo = Number(to.style.left.substr(0, to.style.left.length - 2));
    what.style.left = (xTo + to.offsetWidth - what.offsetWidth).toString() + "px";
}
function appendBottom(idWhat, idTo){
    var what = document.getElementById(idWhat);
    var to = document.getElementById(idTo);
    var yTo = Number(to.style.top.substr(0, to.style.top.length - 2));
    what.style.top = (yTo + to.offsetHeight + 5).toString() + "px";
}
function appendBottom1(idWhat, idTo, offset){
    var what = document.getElementById(idWhat);
    var to = document.getElementById(idTo);
    var yTo = Number(to.style.top.substr(0, to.style.top.length - 2));
    what.style.top = (yTo + to.offsetHeight + offset).toString() + "px";
}
function putHref(x,y,text,_link,id) {
    var a = document.createElement("a");
    a.appendChild(document.createTextNode(text));
    a.href = _link;
    var table = document.createElement("table");
    table.setAttribute("border", "0");
    table.setAttribute("id", id);
    table.style.position = "absolute";
    table.style.left = x;
    table.style.top = y;
    table.appendChild(a);
    document.body.appendChild(table);
}
function putButton(x,y,text,onclick,id){
    var button = document.createElement("button");
    button.appendChild(document.createTextNode(text));
    button.setAttribute("onclick", onclick);
    button.setAttribute("id", id);
    button.style.position = "absolute";
    button.style.left = x;
    button.style.top = y;
    document.body.appendChild(button);
}
function putText(x,y,text,id) {
    var table = document.createElement("table");
    table.setAttribute("border", "0");
    table.setAttribute("id", id);
    table.style.position = "absolute";
    table.style.left = x;
    table.style.top = y;
    table.appendChild(document.createTextNode(text));
    document.body.appendChild(table);
    return table.offsetWidth;
    //не менять return, иначе
    //перестанет работать 
    //разложение по степеням
}
function putInput(x,y,width,id){
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", "");
    input.setAttribute("id", id);
    input.style.position = 'absolute';
    input.style.left = x;
    input.style.top = y;
    input.style.width = width;
    document.body.appendChild(input);
    return input.offsetWidth;
    //не менять return, иначе
    //перестанет работать
    //разложение по степеням
}
function putTextArea(x,y,rows,cols,id){
    var textArea = document.createElement("textarea");
    textArea.setAttribute("id", id);
    textArea.style.position = "absolute";
    //textArea.style.minWidth = "500px";
    textArea.style.left = x;
    textArea.style.top = y;
    textArea.rows = rows;
    textArea.cols = cols;
    document.body.appendChild(textArea);
}
function rand(maxValue){
    return Math.floor(Math.random() * maxValue);
}
function binLen(i){
    let ans = 0;
    do {
        i >>= 1;
        ++ans;
    } while (i > 0);
    return ans;
}
function bitAt(n,i){
    return (n & (1 << i)) == 0 ? 0 : 1;
}
function binString(n){
    let s = "";
    for(let i = binLen(n) - 1; i >= 0; --i)
        s += (n & (1 << i)) == 0 ? '0' : '1';
    return s;
}
