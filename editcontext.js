let EditContextTextRange = (() => {
    class EditContextTextRange {
        constructor(start, end) {
            this.start = start;
            this.end = end;
        }

        assign(other) {
            assert(other.__proto__ === EditContextTextRange.prototype, "Can only assign EditContextTextRange to another EditContextTextRange object");
            this.start = other.start;
            this.end = other.end;
        }
    }

    return EditContextTextRange;
})();


let EditContext = (() => {
    class EditContext extends EventTarget {
        constructor() {
            super()
            // Create a 'native edit context' via contenteditable div
            this.nativeEditContext = document.createElement('div');
            this.nativeEditContext.setAttribute("contenteditable", "true");
            this.nativeEditContext.style = "caret-color:transparent; position:absolute; top:20px; right:20px";
            document.body.appendChild(this.nativeEditContext);
            this.nativeEditContext.addEventListener("keypress", evt => {
                // Don't dispatch "Enter" as textupdating since it is a control
                // character.
                if (evt.key !== "Enter") {
                    let textUpdatingEvent = new Event("textupdating");
                    textUpdatingEvent.text = evt.key;
                    this.dispatchEvent(textUpdatingEvent);
                }
                evt.preventDefault();
            });

            this.nativeEditContext.addEventListener("keydown", evt => {
                let keydownEvent = new Event("keydown");
                keydownEvent.key = evt.key;
                this.dispatchEvent(keydownEvent);
            });

            this.nativeEditContext.addEventListener("keyup", evt => {
                let keyupEvent = new Event("keyup");
                keyupEvent.key = evt.key;
                this.dispatchEvent(keyupEvent);
            });

            this.nativeEditContext.addEventListener("focus", evt => {
                let focusEvent = new Event("focus");
                this.dispatchEvent(focusEvent);
            });

            this.nativeEditContext.addEventListener("blur", evt => {
                let blurEvent = new Event("blur");
                this.dispatchEvent(blurEvent);
            });
        }

        focus() {
            this.nativeEditContext.focus();
        }

        blur() {
            this.nativeEditContext.blur();
        }

        updateSelectionRange(selectionRange) {
            this.selectionRange.assign(selectionRange);
        }

        hasFocus() {
            return this.nativeEditContext === document.activeElement;
        }

        textChanged() {

        }
    }

    return EditContext;
})()

