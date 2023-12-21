((function () {
    var QBU = {
        applyFieldPrefix: function (options) {
            if (options.filters) {
                options.filters = JSON.parse(JSON.stringify(options.filters, function (key, value) {
                    if (key === "field") {
                        if (("" + value).toLowerCase() === "group") {
                            //"group" is a reserved SQL keyword, hence prefixing it.
                            return "sspexp_group";
                        }
                        return value;
                    }
                    return value;
                }));
            }
        },
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
