import config from './epris.config';

const prefix = config.prefix + 'on:';

class EprisEvents {
    check(event: string) {
        return event.includes(prefix);
    }

    addEvent(el: HTMLElement, event: string, action: EventListener) {
        el.addEventListener(event, action);
    }

    addEvents(el: HTMLElement, events: {[key: string]: EventListener}) {
        Object
            .entries(events)
            .forEach(([event, handler]) => {
                return this.addEvent(el, event, handler);
            });
    }

    make(on: {[key: string]: EventListener}, propName: string, handler: EventListener, args: any[]) {
        const event = propName.slice(prefix.length, propName.length);

        Object.defineProperty(on, event, {
            value: handler.bind(null, ...args),
            writable: true,
            enumerable: true,
            configurable: true,
        });

        return on;
    }
}

export default new EprisEvents();
