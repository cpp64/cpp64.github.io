var cppEditor = CodeMirror(document.getElementById("codediv"), {
        lineNumbers: true,
        matchBrackets: true,
        mode: "text/x-c++src",
});
var precode1 = "#include <cmath>\n" + "#include <iostream>\n" + "using namespace std;\n" + "int main(){\n";
var precode2 = "#include <cmath>\n" + "#include <iostream>\n" + "#define or ||\n" + "#define and &&\n" + "#define bool int\n" + "using namespace std;\n" + "int main(){\n";
var postcode = "\nreturn 0;\n}";

function cod() {
        navigator.clipboard.writeText(precode1 + cppEditor.getValue() + postcode);
}

function run() {
        navigator.clipboard.writeText(cppEditor.getValue());
        var output = "";
        var config = {
                stdio: {
                        write: function(s) {
                                output +=  s;
                        }
                }
        };
        var code = precode2 + cppEditor.getValue() + postcode;
        var input = document.getElementById("area2").value;
        var exitCode;
        try {
                exitCode = JSCPP.run(code, input, config);
                document.getElementById("area3").value = output;
        } catch (err) {
                document.getElementById("area3").value = "Error: " + (err.message || err);
        }
}
