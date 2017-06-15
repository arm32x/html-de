var os = { window: { }, elements: { }, preferences: {
    
} };
os.window.all = [];
os.window.recalculateZIndexes = (topWindow) => {
    let windows = [];
    windows.push(topWindow);
    {
        let index = os.window.all.indexOf(topWindow);
        if (index > -1) {
            os.window.all.splice(index, 1);
        }
    }
    os.window.all.forEach((window) => {
        windows.push(window);
    });
    os.window.all = [];
    windows.forEach((window, index) => {
        window.classList.remove("is-active");
        window.zIndex = -index;
        os.window.all.unshift(window);
    });
    topWindow.classList.add("is-active");
};

os.elements.Window = document.registerElement("os-window", {
    prototype: Object.create(HTMLDivElement.prototype, {
        createdCallback: {
            value() {
                let window = this;
                os.window.all.push(window);
                os.window.recalculateZIndexes(window);
                let handle = this.getElementsByTagName("header")[0].getElementsByClassName("title")[0];
                let startX, startY, offsetX, offsetY;
                let mousemoveEventListener = (e) => {
                    let x = e.screenX - startX + offsetX; 
                    let y = e.screenY - startY + offsetY;
                    window.style.left = x + "px";
                    window.style.top = y + "px";
                };
                handle.addEventListener("mousedown", (e) => {
                    startX = e.screenX;
                    startY = e.screenY;
                    let rect = window.getBoundingClientRect();
                    offsetX = rect.left;
                    offsetY = rect.top;

                    os.window.recalculateZIndexes(window);

                    if (!window.classList.contains("is-maximized")) {
                        if (handle.setCapture) {
                            handle.setCapture(true);
                        }
                        document.addEventListener("mousemove", mousemoveEventListener);
                    }
                    
                    document.getElementsByTagName("html")[0].classList.add("window-is-dragging");
                });
                document.addEventListener("mouseup", () => {
                    startX = undefined;
                    startY = undefined;
                    offsetX = undefined;
                    offsetY = undefined;
                    
                    if (document.releaseCapture) {
                        document.releaseCapture();
                    }
                    document.removeEventListener("mousemove", mousemoveEventListener);
                    document.getElementsByTagName("html")[0].classList.remove("window-is-dragging");
                });
            }
        },
        zIndex: {
            get() {
                return parseInt (this.style.zIndex);
            },
            set(zIndex) {
                this.style.zIndex = zIndex;
            }
        }
    })
});
os.elements.WindowControl = document.registerElement("window-control", {
    prototype: Object.create(HTMLButtonElement.prototype, {
        createdCallback: {
            value() {
                let window = this.parentNode.parentNode.parentNode;
                switch (this.className) {
                    case "window-close":
                        this.title = "Close";
                        this.addEventListener("click", () => {
                            let bodyElem = document.getElementsByTagName("body")[0];
                            bodyElem.removeChild(window);
                        });
                        break;
                    case "window-minimize":
                        this.title = "Minimize";
                        this.addEventListener("click", () => {
                            if (!window.classList.contains("is-minimized")) {
                                window.classList.remove("is-minimized");
                            } else {
                                window.classList.remove("is-maximized");
                                window.classList.add("is-minimized");
                            }
                        });
                        break;
                    case "window-shade":
                        this.title = "Shade";
                        this.addEventListener("click", () => {
                            if (!window.classList.contains("is-shaded")) {
                                window.classList.remove("is-shaded");
                            } else {
                                window.classList.remove("is-maximized");
                                window.classList.add("is-shaded");
                            }
                        });
                        break;
                    case "window-maximize":
                        this.title = "Maximize";
                        this.addEventListener("click", () => {
                            if (!window.classList.contains("is-maximized")) {
                                window.classList.remove("is-maximized");
                            } else {
                                window.classList.remove("is-shaded");
                                window.classList.remove("is-minimized");
                                window.classList.add("is-maximized");
                            }
                        });
                        break;
                }
            }
        }
    }),
    extends: "button"
});

os.elements.WindowBar = document.registerElement("os-window-bar", {
   prototype: Object.create(HTMLUListElement.prototype, {
       createdCallback: {
           value() {
               for (let window of os.window.all) {
                   
               }
           }
       },
       add: {
           value(window) {
               let item = document.createElement("li");
           }
       }
   })
});