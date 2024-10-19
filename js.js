function myFunction() {
        var x = document.getElementById("mynavigation");
        if (x.className === "navigation") {
                x.className += " responsive";
        } else {
                x.className = "navigation";
        }
}
