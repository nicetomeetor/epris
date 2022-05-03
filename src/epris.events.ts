import config from './epris.config';
import { VirtualNode } from './epris.types';

const prefix = config.prefix + 'on:';

export const isEvent = (event: string) => event.includes(prefix);

export const addEvent = (el: HTMLElement, e: string, action: EventListener) => {
    el.addEventListener(e, action);
};

export const removeEvent = (el: HTMLElement, e: string, action: EventListener) => {
    el.removeEventListener(e, action);
};

export const removeEvents = (el: HTMLElement, events: {[key: string]: EventListener}) => {
    Object
        .entries(events)
        .forEach(([event, handler]) => {
            removeEvent(el, event, handler);
        });
};

export const addEvents = (el: HTMLElement, events: {[key: string]: EventListener}) => {
    Object
        .entries(events)
        .forEach(([event, handler]) => {
            addEvent(el, event, handler);
        });
}

export const updateEvents = (vNode: VirtualNode, newVNode: VirtualNode)  => {
    removeEvents(vNode.el, vNode.on);
    addEvents(vNode.el, newVNode.on)
}

export const attachEvent = (on: {[key: string]: EventListener}, propName: string, handler: EventListener, args: any[]) => {
    const event = propName.slice(prefix.length, propName.length);

    Object.defineProperty(on, event, {
        value: args.length < 1 ? handler.bind(null, ...args) : handler,
        writable: true,
        enumerable: true,
        configurable: true,
    });

    return on;
}

