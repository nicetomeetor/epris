import config from './epris.config';

import {
    VirtualNode,
} from './epris.types';

import {
    Element,
} from './epris.interfaces';

const prefix = config.prefix + 'on:';

export const isEvent = (event: string): boolean => event.includes(prefix);

export const addEvent = (
    element: HTMLElement,
    event: string,
    action: EventListener,
): void => {
    element.addEventListener(event, action);
};

export const removeEvent = (
    element: HTMLElement,
    event: string,
    action: EventListener,
): void => {
    element.removeEventListener(event, action);
};

const eachEvents = (
    element: HTMLElement,
    events: { [key: string]: EventListener },
    func: Function,
): void => {
    Object
        .entries(events)
        .forEach(([event, handler]) => {
            func(element, event, handler);
        });
};

export const removeEvents = (
    element: HTMLElement,
    events: { [key: string]: EventListener },
): void => {
    eachEvents(
        element,
        events,
        removeEvent,
    );
};

export const addEvents = (
    element: HTMLElement,
    events: { [key: string]: EventListener },
): void => {
    eachEvents(
        element,
        events,
        addEvent,
    );
};

export const updateEvents = (
    vNode: VirtualNode,
    newVNode: VirtualNode,
): void => {
    removeEvents(vNode.el, vNode.on);
    addEvents(vNode.el, newVNode.on);
};

export const attachEvent = (
    element: Element,
    propName: string,
    handler: EventListener,
    args: any[],
): void => {
    const event: string = propName.slice(prefix.length, propName.length);
    const value: EventListener = args.length > 0 ? handler.bind(null, ...args) : handler;

    Object.defineProperty(
        element.on,
        event,
        {
            value,
            writable: true,
            enumerable: true,
            configurable: true,
        }
    );
};

