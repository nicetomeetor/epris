import {
    addEvents,
    removeEvents,
    updateEvents,
} from './epris.events';

import {
    VirtualNode,
} from './epris.types';

import {
    control,
} from './epris.forms';

export const h = (
    tag: string,
    props: { [key: string]: string },
    children: Array<VirtualNode> | string,
    on: { [key: string]: EventListener },
): VirtualNode => {
    return {
        tag,
        props,
        children,
        on,
    };
};

export const mount = (
    node: VirtualNode,
    parentElement: HTMLElement,
): void => {
    const tag = node.tag;
    const props = node.props;
    const children = node.children;
    const on = node.on || {};

    const element = document.createElement(tag);

    addEvents(element, on);

    for (const key in props) {
        element.setAttribute(key, props[key]);
    }

    if (typeof children == 'string') {
        element.textContent = children;
    } else {
        children
            .forEach(child => {
                mount(child, element);
            });
    }

    node.el = element;

    control(node);

    parentElement.appendChild(element);
};

export const unmount = (node: VirtualNode): void => {
    removeEvents(node.el, node.on);
    node.el.parentNode.removeChild(node.el);
};

export const patch = (
    node: VirtualNode,
    newNode: VirtualNode,
): void => {
    updateEvents(node, newNode);

    if (node.tag !== newNode.tag) {
        mount(newNode, node.el.parentElement);
        unmount(node);
    } else {
        newNode.el = node.el;

        while (newNode.el.attributes.length > 0) {
            newNode.el.removeAttribute(newNode.el.attributes[0].name);
        }

        for (const key in newNode.props) {
            newNode.el.setAttribute(key, newNode.props[key]);
        }

        if (typeof newNode.children === 'string') {
            newNode.el.textContent = newNode.children;
        } else {
            if (typeof node.children === 'string') {
                newNode.el.textContent = null;
                newNode.children.forEach(child => {
                    mount(child, newNode.el);
                });
            } else {
                const minChildrenLength = Math.min(node.children.length, newNode.children.length);
                for (let i = 0; i < minChildrenLength; i++) {
                    patch(node.children[i], newNode.children[i]);
                }

                if (node.children.length > newNode.children.length) {
                    node.children.slice(newNode.children.length).forEach(child => {
                        unmount(child);
                    });
                }

                if (node.children.length < newNode.children.length) {
                    newNode.children.slice(node.children.length).forEach(child => {
                        mount(child, newNode.el);
                    });
                }
            }
        }
    }

    control(newNode);
};