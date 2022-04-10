import config from './epris.config';
import { VirtualNode } from './epris.types';

const prefix = config.prefix + 'on:';

class EprisEvents {
    check(event: string) {
        return event.includes(prefix);
    }

    addEvent(el: HTMLElement, event: string, action: EventListener) {
        el.addEventListener(event, action);
        // console.log(event, action)
    }

    removeEvent(el: HTMLElement, event: string, action: EventListener) {
        el.removeEventListener(event, action);
    }

    removeEvents(el: HTMLElement, events: {[key: string]: EventListener}) {
        Object
            .entries(events)
            .forEach(([event, handler]) => {
                return this.removeEvent(el, event, handler);
            });
    }

    addEvents(el: HTMLElement, events: {[key: string]: EventListener}) {
        Object
            .entries(events)
            .forEach(([event, handler]) => {
                return this.addEvent(el, event, handler);
            });
    }

    updateEvents(vNode: VirtualNode, newVNode: VirtualNode) {
        this.removeEvents(vNode.$el, newVNode.on);
        this.addEvents(vNode.$el, newVNode.on)
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
