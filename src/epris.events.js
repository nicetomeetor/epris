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

    make(props, propName, handler) {
        const event = propName.slice(prefix.length, propName.length);

        if(!props.on) {
            Object.defineProperty(props, 'on', {
                value: {},
                writable: true,
                enumerable: false,
                configurable: true
            });
        }

        Object.defineProperty(props.on, event, {
            value: handler,
            writable: true,
            enumerable: true,
            configurable: true
        });

        return props.on;
    }
}

export default new EprisEvents();
