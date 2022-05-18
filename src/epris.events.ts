import config from './epris.config';

import {
    Element,
    VirtualNode,
} from './epris.types';

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

const eachEvents = (
    element: HTMLElement,
    events: { [key: string]: EventListener },
    func: Function,
) => {
    Object
        .entries(events)
        .forEach(([event, handler]) => {
            func(element, event, handler);
        });
};

export const removeEvents = (
    element: HTMLElement,
    events: { [key: string]: EventListener },
) => {
    eachEvents(
        element,
        events,
        removeEvent,
    );
};

export const addEvents = (
    element: HTMLElement,
    events: { [key: string]: EventListener },
) => {
    eachEvents(
        element,
        events,
        addEvent,
    );
};

export const updateEvents = (
    vNode: VirtualNode,
    newVNode: VirtualNode,
) => {
    removeEvents(vNode.el, vNode.on);
    addEvents(vNode.el, newVNode.on);
};

export const attachEvent = (
    element: Element,
    propName: string,
    handler: EventListener,
    args: any[],
) => {
    const event = propName.slice(prefix.length, propName.length);
    const value = args.length > 0 ? handler.bind(null, ...args) : handler;

    Object.defineProperty(element.on, event, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
    });
};

