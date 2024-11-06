/// HEAD

var meta_charset = document.createElement('meta');
meta_charset.charset = "UTF-8";
document.head.insertBefore(meta_charset, document.head.firstChild);

var meta_viewport = document.createElement('meta');
meta_viewport.name = "viewport";
meta_viewport.content = "width = device-width, initial-scale = 1.0";
document.head.insertBefore(meta_viewport, document.head.firstChild);

var link_style = document.createElement('link');
link_style.rel = "stylesheet";
link_style.type = "text/css";
link_style.href = "/style.css";
document.head.insertBefore(link_style, document.head.firstChild);

var link_icon = document.createElement('link');
link_icon.rel = "icon";
link_icon.type = "image/png";
link_icon.sizes = "192x192";
link_icon.href = "/icons/dove32w2.ico";
document.head.insertBefore(link_icon, document.head.firstChild);

/// BODY

// NAVIGATION

var div_navigation = document.createElement('div');
div_navigation.id = "navigation";
div_navigation.className  = "navigation";

var _menu = document.createElement('a');
_menu.className  = "T2";
_menu.href = "javascript:void(0);";
_menu.onclick = myFunction;
_menu.appendChild(document.createTextNode("Меню"));

div_navigation.appendChild(_menu);

var _index = document.createElement('a');
_index.className  = "T1";
_index.href = "/index.html";

var _img = document.createElement('img');
_img.src = "/icons/dove32w2.ico";
_img.style = "vertical-align: middle; margin-right: 5px;";

_index.appendChild(_img);
_index.appendChild(document.createTextNode("Информатика"));

div_navigation.appendChild(_index);

var _7kl = document.createElement('a');
_7kl.className  = "T1";
_7kl.href = "/7kl/7kl.html";
_7kl.appendChild(document.createTextNode("7 класс"));

div_navigation.appendChild(_7kl);

var _8kl = document.createElement('a');
_8kl.className  = "T1";
_8kl.href = "/8kl/8kl.html";
_8kl.appendChild(document.createTextNode("8 класс"));

div_navigation.appendChild(_8kl);

var _9kl = document.createElement('a');
_9kl.className  = "T1";
_9kl.href = "/9kl/9kl.html";
_9kl.appendChild(document.createTextNode("9 класс"));

div_navigation.appendChild(_9kl);

var _10kl = document.createElement('a');
_10kl.className  = "T1";
_10kl.href = "/10kl/10kl.html";
_10kl.appendChild(document.createTextNode("10 класс"));

div_navigation.appendChild(_10kl);

var _sgu = document.createElement('a');
_sgu.className  = "T1";
_sgu.href = "/sgu/sgu.html";
_sgu.appendChild(document.createTextNode("Студенты"));

div_navigation.appendChild(_sgu);

document.body.insertBefore(div_navigation, document.body.firstChild);

function myFunction() {
        var x = document.getElementById("navigation");
        if (x.className === "navigation") {
                x.className += " responsive";
        } else {
                x.className = "navigation";
        }
}
