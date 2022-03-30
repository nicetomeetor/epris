import { Actions, VirtualNode } from './epris.types';
import eventsObject from './epris.events';
import directiveObject from './epris.directives';
import { h } from './epris.vdom';

const funRegExp = /(.*)\((.*)\)/;
// const argRegExp = /(.*)(\.?)(.*)/;

export const chainElementKeys = (element: any, state: any) => {
    const data = element.data;
    const keys = element.keys;
    let chainedData = state[data];
    keys.forEach((key: string) => {
        chainedData = chainedData[key];
    });
    return chainedData;
};

const chainElementsKeys = (elements: any, state: any) => {
    return elements.map((element: any) => chainElementKeys(element, state));
};

const parseArg = (arg: Array<string>) => {
    const data = arg[0];
    const keys = arg.slice(1);
    return {
        keys,
        data,
    };
};

const parseArgs = (args: Array<Array<string>>) => {
    const elements: Array<any> = [];
    args.forEach((arg: Array<string>) => {
        const element = parseArg(arg);
        elements.push(element);
    });

    return elements;
};

const parseEvent = (propValue: string) => {
    const values = propValue.match(funRegExp);
    const method = values[1];
    const args = values[2]
        .split(',')
        .map((arg: string) => arg.split('.'));

    return {
        method,
        args,
    };
};

export const parseDirective = (propValue: string) => {
    const values = propValue.split('.');
    return parseArg(values);
};

export const parse = (
    node: HTMLElement,
    state: { [key: string]: any },
    methods: Actions,
): VirtualNode | null => {
    const attributes = Array.from(node.attributes);
    const props: { [key: string]: any } = {};
    let on: { [key: string]: EventListener } = {};

    let children: Array<any> = Array.from(node.children);

    const parseObject: { [key: string]: any } = {
        status: true,
        children: '',
    };

    attributes.forEach((attribute) => {
        const propName = attribute.name;
        const propValue = attribute.value;

        if (eventsObject.check(propName)) {
            const parsedEvent = parseEvent(propValue);
            const handler: EventListener = methods[parsedEvent.method];
            const args = chainElementsKeys(parseArgs(parsedEvent.args), state);
            on = eventsObject.make(on, propName, handler, args);

        } else if (directiveObject.check(propName)) {
            const parsedDirective = parseDirective(propValue);
            const directive = directiveObject.make(propName, propValue, state, methods, node.cloneNode(true));
            parseObject[directive.key] = directive.value;
        } else {
            props[propName] = propValue;
        }
    });

    if (!parseObject.status) {
        return null;
    }

    if (parseObject.children.length > 0 || typeof parseObject.children === 'object') {
        children = [];
    }

    if (!children.length) {
        if (parseObject.children.length) {
            return h(node.tagName, props, parseObject.children, on);
        } else {
            return h(node.tagName, props, node.textContent || '', on);
        }
    } else {
        const nodeChildren = [];
        for (let i = 0; i < children.length; i++) {
            const parsed = parse(children[i] as HTMLElement, state, methods);

            if (parsed) {
                nodeChildren.push(parsed);
            }
        }

        return h(node.tagName, props, nodeChildren, on);
    }
};