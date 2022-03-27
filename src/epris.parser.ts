import { Actions, VirtualNode } from './epris.types';
import eventsObject from './epris.events';
import directiveObject from './epris.directives';
import { h } from './epris.vdom';

const funRegExp = /(.*)\((.*)\)/;
// const argRegExp = /(.*)(\.?)(.*)/;

const chainDataKeys = (elements: any, state: any) => {
    return elements.map((element: any) => {
        const data = element.data;
        const keys = element.keys;
        let chainedData = state[data];
        keys.forEach((key: string) => {
            chainedData = chainedData[key];
        });
        return chainedData;
    })
};

const parseArgs = (args: Array<Array<string>>) => {
    const elements: Array<any> = [];
    args.forEach((arg: Array<string>) => {
        const data = arg[0];
        const keys = arg.slice(1);
        elements.push(
            {
                keys,
                data,
            },
        );
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

const parseDirective = () => {

};

export const parse = (
    node: HTMLElement,
    state: { [key: string]: any },
    methods: Actions,
): VirtualNode | null => {
    const attributes = node.attributes;
    const n = attributes.length;
    const props: { [key: string]: any } = {};

    let children: Array<any> = Array.from(node.children);

    const parseObject: { [key: string]: any } = {
        status: true,
        children: '',
    };

    for (let i = 0; i < n; i++) {
        const propName = attributes[i].name;
        const propValue = attributes[i].value;

        if (eventsObject.check(propName)) {
            const parsedEvent = parseEvent(propValue);
            const handler: EventListener = methods[parsedEvent.method]
            const args = chainDataKeys(parseArgs(parsedEvent.args), state)
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