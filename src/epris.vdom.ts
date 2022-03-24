import events from './epris.events';
import eventsObject from './epris.events';
import directiveObject from './epris.directives';
import { Actions } from './epris.types';

type h = {
    tag: string,
    props: { [key: string]: string },
    children: Array<h> | string,
    $el?: HTMLElement
};

export const h = (
    tag: string,
    props: { [key: string]: string },
    children: Array<h> | string,
) => {
    return {
        tag,
        props,
        children,
    };
};

export const mount = (node: h, container: HTMLElement) => {
    const tag = node.tag;
    const props = node.props;
    const children = node.children;

    const on: any = props.on;

    const el = document.createElement(tag);

    if (on) {
        events.addEvents(el, on);
    }

    for (const key in props) {
        el.setAttribute(key, props[key]);
    }

    if (typeof children == 'string') {
        el.textContent = children;
    } else {
        children
            .forEach(child => {
                mount(child, el);
            });
    }

    node.$el = el;
    container.appendChild(el);

    return node;
};

export const unmount = (node: h) => {
    node.$el.parentNode.removeChild(node.$el);
};

export const patch = (node: h, newNode: h) => {
    if (node.tag !== newNode.tag) {
        mount(newNode, node.$el.parentElement);
        unmount(node);
    } else {
        newNode.$el = node.$el;

        if (typeof newNode.children === 'string') {
            newNode.$el.textContent = newNode.children;
        } else {
            while (newNode.$el.attributes.length > 0) {
                newNode.$el.removeAttribute(newNode.$el.attributes[0].name);
            }

            for (const key in newNode.props) {
                newNode.$el.setAttribute(key, newNode.props[key]);
            }

            if (typeof node.children === 'string') {
                newNode.$el.textContent = null;
                newNode.children.forEach(child => {
                    mount(child, newNode.$el);
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
                        mount(child, newNode.$el);
                    });
                }
            }
        }
    }
};

export const parse = (
    node: HTMLElement,
    state: {[key: string]: any},
    methods: Actions
): h | null => {
    const attributes = node.attributes;
    const n = attributes.length;
    const props: {[key: string]: any} = {};

    let children: Array<any> = Array.from(node.children)

    const parseObject: {[key: string]: any} = {
        status: true,
        children: '',
    };

    for (let i = 0; i < n; i++) {
        const propName = attributes[i].name;
        const propValue = attributes[i].value;

        if (eventsObject.check(propName)) {
            const regExp = /(.*)\((.*)\)/
            const values = propValue.match(regExp)
            const method = values[1]
            const handler: EventListener = methods[method];
            const args = values[2]
                .split(',')
                .map(arg => state[arg])
            props.on = eventsObject.make(props, propName, handler, args);

        } else if (directiveObject.check(propName)) {
            const directive = directiveObject.make(propName, propValue, state, methods, node.cloneNode(true));
            parseObject[directive.key] = directive.value;

        } else {
            props[propName] = propValue;
        }
    }

    if (!parseObject.status) {
        return null;
    }

    if (parseObject.children.length > 0) {
        children = [];
    }

    if (children.length < 1) {
        if (parseObject.children.length) {
            return h(node.tagName, props, parseObject.children);
        } else {
            return h(node.tagName, props, node.textContent || '');
        }
    } else {
        const nodeChildren = [];
        for (let i = 0; i < children.length; i++) {
            const parsed = parse(children[i] as HTMLElement, state, methods);

            if (parsed) {
                nodeChildren.push(parsed);
            }
        }
        return h(node.tagName, props, nodeChildren);
    }
};