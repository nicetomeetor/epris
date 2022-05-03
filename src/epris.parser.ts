import { attachEvent, isEvent, updateEvents } from './epris.events';
import { isDirective, useDirective } from './epris.directives';
import Epris from './epris';
import { regExpEmpty, regExpFun, regPropModifierName, regPropModifierValue } from './epris.regexp';
import { h } from './epris.vdom';
import { VirtualNode } from './epris.types';

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
    const values = propValue.match(regExpFun);
    const action = values[1];
    const rawArgs = values[2];
    const args = rawArgs
        .replace(regExpEmpty, '')
        .split(',')
        .map((arg: string) => arg.split('.'));

    return {
        action,
        args: rawArgs ? args : [],
    };
};

export const parseDirective = (propValue: string) => {
    const values = propValue.split('.');

    return parseArg(values);
};

export const mutate = (
    element: HTMLElement,
    context: Epris,
) => {
    const attributes = Array.from(element.attributes);
    const children = Array.from(element.children);

    for (const attribute of attributes) {
        const propName = attribute.name;
        const propValue = attribute.value;

        const rawPropModifierName = propName.match(regPropModifierName);
        const propModifierName = rawPropModifierName ? rawPropModifierName[1] : propName;

        const rawPropModifierValue = propName.match(regPropModifierValue);
        const propModifierValue = rawPropModifierValue ? rawPropModifierValue[1] : propValue;

        if (isDirective(propModifierName)) {
            updateDirective({
                propValue, context, 'node': element, propName, propModifierName, propModifierValue,
            });
        }

        // if (isEvent(propName)) {
        //     updateOn({propValue, context, propName, element})
        // }
    }

    if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            mutate(children[i] as HTMLElement, context);
        }
    }
};

export const parse = (node: HTMLElement): VirtualNode => {
    const attributes = node.attributes;
    const n = attributes.length;
    const props: { [key: string]: any } = {};
    const children = node.children;

    for (let i = 0; i < n; i++) {
        const propName = attributes[i].name;
        props[propName] = attributes[i].value;
    }

    if (children.length < 1) {
        return h(node.tagName, props, node.textContent || '', {});
    } else {
        const nodeChildren = [];
        for (let i = 0; i < children.length; i++) {
            const parsed = parse(children[i] as HTMLElement);
            if (parsed) {
                nodeChildren.push(parsed);
            }
        }
        return h(node.tagName, props, nodeChildren, {});
    }
};

const updateOn = ({ propValue, context, propName, element, on }: any) => {
    const actions = context.actions;
    const state = context.state;

    const { args, action } = parseEvent(propValue);
    const handler: EventListener = actions[action];
    const chainedArgs = chainElementsKeys(parseArgs(args), state);
    on = attachEvent(on, propName, handler, chainedArgs);
    updateEvents(element, on);
};

const updateDirective = ({ propValue, context, node, propName, propModifierName, propModifierValue }: any) => {
    const parsedDirective = parseDirective(propValue);
    node.removeAttribute(propName);

    useDirective(
        propModifierName,
        {
            rawValue: parsedDirective,
            node,
            context,
            propModifierValue,
            propModifierName,
            propName,
        },
    );
};