import config from './epris.config';
import { VirtualNode } from './epris.types';

const prefix = config.prefix + 'on:';

export const isEvent = (event: string) => event.includes(prefix);

export const addEvent = (
    element: HTMLElement,
    event: string,
    action: EventListener,
) => {
    element.addEventListener(event, action);
};

export const removeEvent = (
    element: HTMLElement,
    event: string,
    action: EventListener,
) => {
    element.removeEventListener(event, action);
};

export const removeEvents = (
    element: HTMLElement,
    events: { [key: string]: EventListener },
) => {
    Object
        .entries(events)
        .forEach(([event, handler]) => {
            removeEvent(element, event, handler);
        });
};

export const addEvents = (
    el: HTMLElement,
    events: { [key: string]: EventListener },
) => {
    Object
        .entries(events)
        .forEach(([event, handler]) => {
            addEvent(el, event, handler);
        });
};

export const updateEvents = (
    vNode: VirtualNode,
    newVNode: VirtualNode,
) => {
    removeEvents(vNode.el, vNode.on);
    addEvents(vNode.el, newVNode.on);
};

export const attachEvent = (
    on: { [key: string]: EventListener },
    propName: string,
    handler: EventListener,
    args: any[],
) => {
    const event = propName.slice(prefix.length, propName.length);
    const value = args.length > 0 ? handler.bind(null, ...args) : handler;

    Object.defineProperty(on, event, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
    });

    return on;
};

