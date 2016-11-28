var os = {
    elements: {
        WindowControl: document.registerElement ("window-control", {
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
        })
    }
};