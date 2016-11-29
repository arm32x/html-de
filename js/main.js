var os = { window: {}, elements: {} };
os.window.all = [],
os.window.recalculateZIndexes = function (topWindow) {
    let windows = [];
    windows.push (topWindow);
    {
        let index = os.window.all.indexOf (topWindow);
        if (index > -1) {
            os.window.all.splice (index, 1);
        }
    }
    os.window.all.forEach (function (window) {
        windows.push (window);
    });
    os.window.all = [];
    windows.forEach (function (window, index) {
        window.zIndex = -index;
        console.log (os.window.all);
        os.window.all.unshift (window);
    });
};

os.elements.Window = document.registerElement ("os-window", {
    prototype: Object.create (HTMLDivElement.prototype, {
        createdCallback: {
            value: function () {
                let window = this;
                os.window.all.push (window);
                os.window.recalculateZIndexes (window);
                let handle = this.getElementsByTagName ("header")[0].getElementsByClassName("title")[0];
                let startX, startY, offsetX, offsetY;
                let mousemoveEventListener = function (event) {
                    let x = event.screenX - startX + offsetX; 
                    let y = event.screenY - startY + offsetY;
                    window.style.left = x + "px";
                    window.style.top = y + "px";
                };
                handle.addEventListener ("mousedown", function (event) {
                    startX = event.screenX;
                    startY = event.screenY;
                    let rect = window.getBoundingClientRect ();
                    offsetX = rect.left;
                    offsetY = rect.top;

                    os.window.recalculateZIndexes (window);

                    if (window.className != "is-maximized") {
                        document.addEventListener ("mousemove", mousemoveEventListener);
                    }
                });
                document.addEventListener ("mouseup", function () {
                    startX = undefined;
                    startY = undefined;
                    offsetX = undefined;
                    offsetY = undefined;

                    document.removeEventListener ("mousemove", mousemoveEventListener);
                });
            }
        },
        zIndex: {
            get: function () {
                return parseInt (this.style.zIndex);
            },
            set: function (zIndex) {
                console.log (zIndex);
                this.style.zIndex = zIndex;
            }
        }
    })
});
os.elements.WindowControl = document.registerElement ("window-control", {
    prototype: Object.create (HTMLButtonElement.prototype, {
        createdCallback: {
            value: function () {
                let window = this.parentNode.parentNode.parentNode;
                switch (this.className) {
                    case "window-close":
                        this.addEventListener ("click", function () {
                            let bodyElem = document.getElementsByTagName ("body")[0];
                            bodyElem.removeChild (window);
                        });
                        break;
                    case "window-minimize":
                        this.addEventListener ("click", function () {
                            if (window.className == "is-minimized") {
                                window.className = "";
                            } else {
                                window.className = "is-minimized";
                            }
                        });
                        break;
                    case "window-maximize":
                        this.addEventListener ("click", function () {
                            if (window.className == "is-maximized") {
                                window.className = "";
                            } else {
                                window.className = "is-maximized";
                            }
                        });
                        break;
                }
            }
        }
    }),
    extends: "button"
});