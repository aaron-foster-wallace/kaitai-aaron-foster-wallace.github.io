"use strict";
function checkModifications2() {
    fetch("/onchange").then(_ => location.reload(true), _ => setTimeout(checkModifications, 750));
}
if (location.hostname === "127.0.0.1")
    checkModifications2();
//# sourceMappingURL=autorefresh2.js.map