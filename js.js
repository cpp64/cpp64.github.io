function myFunction() {
        var x = document.getElementById("mynavigation");
        if (x.className === "navigation") {
                x.className += " responsive";
        } else {
                x.className = "navigation";
        }
}
$(function () {
        $("#navigation").load("/navigation.html");
});
/jquery-3.7.1.min.js
<div id="navigation"></div>

<link rel="stylesheet" type="text/css" href="/style.css" />
<link rel="icon" type="image/png" sizes="192x192" href="/icons/dove32w2.ico" />

var meta_charset = document.createElement('meta');
meta_charset.charset = "UTF-8";
document.head.insertBefore(meta_charset, container.head.body);

var meta_viewport = document.createElement('meta');
meta_viewport.name = "viewport";
meta_viewport.content = "width=device-width, initial-scale=1.0";
document.head.insertBefore(meta_viewport, container.head.body);
