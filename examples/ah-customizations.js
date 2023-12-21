((function () {
    var QBU = {
        applyFieldPrefix: function (options) {
            if (options.filters) {
                options.filters = JSON.parse(JSON.stringify(options.filters, function (key, value) {
                    if (key === "field") {
                        if (("" + value).toLowerCase() === "group") {
                            //"group" is a reserved SQL keyword, hence prefixing it.
                            return "sspexp_" + value;
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
        },
        transformSQLToAHExpression: function (sql) {
            var result = sql;
            result = result.replace(/ != /gi, " NE ");
            result = result.replace(/ = /gi, " EQ ");
            result = result.replace(/ < /gi, " LT ");
            result = result.replace(/ <= /gi, " LE ");
            result = result.replace(/ > /gi, " GT ");
            result = result.replace(/ >= /gi, " GE ");
            result = result.replace(/sspexp_/gi, "");
            return result;
        }
    };
    window.QueryBuilderUtil = QBU;
})());
