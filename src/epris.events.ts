const prefix = "e-on:";

class EprisEvents {
    check(event: string) {
        return event.includes(prefix);
    }

    addEvent(el: HTMLElement, event: string, action: EventListener) {
        el.addEventListener(event, action);
    }

    addEvents(el: HTMLElement, events: any) {
        Object
            .entries(events)
            .forEach(([event, handler]) => {
                // @ts-ignore
                return this.addEvent(el, event, handler);
            });
    }

    make(props: any, propName: string, handler: EventListener) {
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
