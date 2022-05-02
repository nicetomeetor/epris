import { VirtualNode } from './epris.types';
import { attachEvent, isEvent } from './epris.events';
import { isDirective, useDirective } from './epris.directives';
import { h } from './epris.vdom';
import Epris from './epris';
import { regExpFun, regExpEmpty, regPropModifierName, regPropModifierValue } from './epris.regexp';

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
    const rawArgs = values[2]
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

export const parse = (
    node: HTMLElement,
    context: Epris
): VirtualNode | null => {
    const attributes = Array.from(node.attributes);

    let props: { [key: string]: any } = {};
    let on: { [key: string]: EventListener } = {};

    let children: Array<any> = Array.from(node.children);

    const parseObject: { [key: string]: any } = {
        status: true,
        children: '',
        props: {}
    };

    for (const attribute of attributes) {
        const propName = attribute.name;
        const propValue = attribute.value;

        const rawPropModifierName = propName.match(regPropModifierName)
        const propModifierName = rawPropModifierName ? rawPropModifierName[1] : propName

        const rawPropModifierValue = propName.match(regPropModifierValue)
        const propModifierValue = rawPropModifierValue ? rawPropModifierValue[1] : propValue

        if (isEvent(propName)) {
            on = updateOn({
                propName, propValue, context, on
            });
        } else if (isDirective(propModifierName)) {
            const { key, value, name, skip } = updateDirective({
                propValue, context, node, propName, propModifierName, propModifierValue
            });

            if (skip) {
                break;
            }

            if (key === 'props') {
                parseObject[key][name] = value;
            } else {
                parseObject[key] = value;
            }
        } else {
            props[propName] = propValue;
        }
    }

    Object.assign(props, parseObject.props)

    if (!parseObject.status) {
        return null;
    }

    if (parseObject.children.length > 0 || typeof parseObject.children === 'object') {
        children = [];
    }

    if (children.length <= 0) {
        if (parseObject.children.length) {
            return h(node.tagName, props, parseObject.children, on);
        } else {
            if (parseObject.children.length === 0 && typeof parseObject.children === 'object') {
                return h(node.tagName, props, '', on);
            }
            return h(node.tagName, props, node.textContent || '', on);
        }
    } else {
        const nodeChildren = [];
        for (let i = 0; i < children.length; i++) {
            const parsed = parse(children[i] as HTMLElement, context);
            
            if (parsed) {
                nodeChildren.push(parsed);
            }
        }

        return h(node.tagName, props, nodeChildren, on);
    }
};

const updateOn = ({propValue, context, on, propName}: any) => {
    const actions = context.actions;
    const state = context.state;

    const { args, action } = parseEvent(propValue);
    const handler: EventListener = actions[action];
    const chainedArgs = chainElementsKeys(parseArgs(args), state);
    on = attachEvent(on, propName, handler, chainedArgs);

    return on;
}

const updateDirective = ({propValue, context, node, propName, propModifierName, propModifierValue}: any) => {
    const parsedDirective = parseDirective(propValue);
    const clonedNode = node.cloneNode(true);
    (clonedNode as HTMLElement).removeAttribute(propName)

    console.log(parsedDirective)

    const {key, value, name, skip} = useDirective(
        propModifierName,
        {
            rawValue: parsedDirective,
            node: clonedNode,
            context,
            propModifierValue
        }
    );

    return {
        key,
        value,
        name,
        skip,
    };
}