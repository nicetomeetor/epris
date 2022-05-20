import Epris from '../epris';

import {
    regExpEmpty,
    regExpFun,
    regPropModifierName,
    regPropModifierValue,
} from '../epris.regexp';

import {
    Element,
    VirtualNode,
} from '../epris.types';

import {
    h,
} from '../epris.vdom';

import {
    detectBoolean,
} from '../epris.helpers';

import {
    useUpdateFunc,
} from './update';

import {
    isEvent,
} from '../epris.events';

import {
    isDirective,
} from '../epris.directives';

const parseArg = (arg: Array<string>) => {
    const data = arg[0];
    const keys = arg.slice(1);

    return {
        keys,
        data,
    };
};

export const parseArgs = (args: Array<Array<string>>) => {
    const elements: Array<any> = [];

    args.forEach((arg: Array<string>) => {
        const element = parseArg(arg);
        elements.push(element);
    });

    return elements;
};

export const parseEvent = (propValue: string) => {
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

const determineProp = (
    propModifierName: string,
    propName: string,
) => {
    if (isDirective(propModifierName)) {
        return 'directive';
    } else if (isEvent(propName)) {
        return 'event';
    }
    return null;
};

export const mutate = (
    node: HTMLElement,
    context: Epris,
) => {
    const attributes = Array.from(node.attributes);
    const children = node.children;
    const n = attributes.length;
    const element = node as Element;

    element.on = element.on || {};

    for (let i = 0; i < n; i++) {
        const propName = attributes[i].name;
        const propValue = attributes[i].value;

        const {
            propModifierName,
            propModifierValue,
        } = parseModifiers(
            propName,
            propValue,
        );

        const determinedProp = determineProp(
            propModifierName,
            propName,
        );

        if (determinedProp) {
            useUpdateFunc(
                determinedProp,
                {
                    propValue,
                    context,
                    propName,
                    propModifierName,
                    propModifierValue,
                    element,
                });
        }
    }

    if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            mutate(
                children[i] as HTMLElement,
                context,
            );
        }
    }
};

export const parse = (node: HTMLElement): VirtualNode => {
    const element = node as Element;

    const attributes = element.attributes;
    const n = attributes.length;
    const props: any = {};

    const children = element.children;

    for (let i = 0; i < n; i++) {
        const propName = attributes[i].name;
        const propValue = attributes[i].value;

        props[propName] = detectBoolean(propValue);
    }

    if (children.length > 0) {
        const nodeChildren = [];

        for (let i = 0; i < children.length; i++) {
            const parsed = parse(children[i] as HTMLElement);

            if (parsed) {
                nodeChildren.push(parsed);
            }
        }

        return h(
            element.tagName,
            props,
            nodeChildren,
            element.on,
        );
    } else {
        return h(
            element.tagName,
            props,
            element.textContent || '',
            element.on,
        );
    }
};

const parseModifiers = (propName: string, propValue: string) => {
    const rawPropModifierName = propName.match(regPropModifierName);
    const propModifierName = rawPropModifierName ? rawPropModifierName[1] : propName;

    const rawPropModifierValue = propName.match(regPropModifierValue);
    const propModifierValue = rawPropModifierValue ? rawPropModifierValue[1] : propValue;

    return {
        propModifierName,
        propModifierValue,
    };
};

