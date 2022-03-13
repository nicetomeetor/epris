const prefix = "e-on:";

class EprisEvents {
    check(event) {
        return event.includes(prefix);
    }

    addEvent(el, event, method) {
        el.addEventListener(event, method);
    }

    addEvents(el, events) {
        Object
            .entries(events)
            .forEach(([event, handler]) => {
                this.addEvent(el, event, handler)
            });
    }

    make(props, event, handler) {
        // if(!Object.keys(props).includes('on')) {
        //     props.on = {};
        // }
        //
        // Object.defineProperty(props.on, event, {
        //     value: handler,
        //     writable: true,
        //     enumerable: false,
        //     configurable: true
        // });

        return props.on
    }
}

export default new EprisEvents();
