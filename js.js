var script = document.createElement("script");
script.src = "/jquery-3.7.1.min.js";
document.body.append(script);

var meta_charset = document.createElement('meta');
meta_charset.charset = "UTF-8";
document.head.insertBefore(meta_charset, document.body.firstChild);

var meta_viewport = document.createElement('meta');
meta_viewport.name = "viewport";
meta_viewport.content = "width=device-width, initial-scale=1.0";
document.head.insertBefore(meta_viewport, document.body.firstChild);

var link_style = document.createElement('link');
link_style.rel = "stylesheet";
link_style.type = "text/css";
link_style.href = "/style.css";
document.head.insertBefore(link_style, document.body.firstChild);

var link_icon = document.createElement('link');
link_icon.rel = "icon";
link_icon.type = "image/png";
link_icon.sizes = "192x192";
link_icon.href = "/icons/dove32w2.ico";
document.head.insertBefore(link_icon, document.body.firstChild);

var div_navigation = document.createElement('div');
div_navigation.id = "navigation";
div_navigation.class = "navigation";
document.head.insertBefore(div_navigation, document.body.firstChild);
$(function () {
        $("#navigation").load("/navigation.html");
});

function myFunction() {
        var x = document.getElementById("navigation");
        if (x.className === "navigation") {
                x.className += " responsive";
        } else {
                x.className = "navigation";
        }
}
