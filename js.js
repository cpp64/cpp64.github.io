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
div_navigation.class = "navigation";
var _menu = document.createElement('href');
_menu.class = "T2";
_menu.href = "javascript:void(0);"
_menu.onclick = "myFunction()"
_menu.appendChild(document.createTextNode("Меню"));
div_navigation.appendChild(_menu);
var _index = document.createElement('href');
_index.class = "T1";
_index.href = "/index.html";
var _img = document.createElement('img');
_img.src = "/icons/dove32w2.ico";
_img.style = "vertical-align: middle; margin-right: 5px;";
_index.appendChild(_img);
_index.appendChild(document.createTextNode("Информатика"));
div_navigation.appendChild(_index);

document.body.insertBefore(div_navigation, document.body.firstChild);

function myFunction() {
        var x = document.getElementById("navigation");
        if (x.className === "navigation") {
                x.className += " responsive";
        } else {
                x.className = "navigation";
        }
}
