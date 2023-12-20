((function () {
    var QBU = {
        restrictSpecialCharsInTextInput: function () {
            document.querySelector("#builder").addEventListener("input", function (e) {
                if (e && e.target && e.target.tagName.toLowerCase() === "input" && e.target.getAttribute("type") === "text") {
                    var updated = false;
                    var val = e.target.value;
                    if (val.indexOf("\"") > -1) {
                        val = val.split("\"").join("");
                        updated = true;
                    }
                    if (val.indexOf("\'") > -1) {
                        val = val.split("\'").join("");
                        updated = true;
                    }
                    if (val.indexOf("(") > -1) {
                        val = val.split("(").join("");
                        updated = true;
                    }
                    if (val.indexOf(")") > -1) {
                        val = val.split(")").join("");
                        updated = true;
                    }
                    if (updated) {
                        e.target.value = val;
                    }
                }
            }, false);
        }
    };
    window.QueryBuilderUtil = QBU;
})());
