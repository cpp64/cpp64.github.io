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
