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

                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" type="text/css" href="/style.css" />
                <link rel="icon" type="image/png" sizes="192x192" href="/icons/dove32w2.ico" />
