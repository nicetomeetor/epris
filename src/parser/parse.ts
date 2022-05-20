import Epris from '../epris';

import {
    regExpEmpty,
    regExpFun,
    regPropModifierName,
    regPropModifierValue,
} from '../epris.regexp';

import {
    ActionData,
    ChainData,
    Element, PropModifiers,
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

const parseArg = (arg: string[]): ChainData => {
    const data = arg[0];
    const keys = arg.slice(1);

    return {
        keys,
        data,
    };
};

export const parseArgs = (
    args: string[][],
): ChainData[] => args.map(parseArg);


export const parseEvent = (propValue: string): ActionData => {
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

export const parseDirective = (propValue: string): ChainData => {
    const values = propValue.split('.');

    return parseArg(values);
};

const determineProp = (
    propModifierName: string,
    propName: string,
): string => {
    let value: string = '';

    if (isDirective(propModifierName)) {
        value = 'directive';
    } else if (isEvent(propName)) {
        value =  'event';
    }

    return value;
};

export const mutate = (
    htmlElement: HTMLElement,
    context: Epris,
): void => {
    const attributes = Array.from(htmlElement.attributes);
    const children = htmlElement.children;
    const n = attributes.length;
    const element = htmlElement as Element;

    element.on = element.on || {};

    for (let i = 0; i < n; i++) {
        const propName = attributes[i].name;
        const propValue = attributes[i].value;

        const {
            propModifierName,
            propModifierValue,
        }: PropModifiers = parseModifiers(
            propName,
            propValue,
        );

        const determinedProp = determineProp(
            propModifierName,
            propName,
        );

        if (determinedProp.length > 0) {
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

export const parse = (htmlElement: HTMLElement): VirtualNode => {
    const element = htmlElement as Element;

    const attributes = element.attributes;
    const n = attributes.length;
    const children = element.children;

    const props: { [key: string]: any } = {};

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

const parseModifiers = (
    propName: string,
    propValue: string,
): PropModifiers => {
    const rawPropModifierName = propName.match(regPropModifierName);
    const propModifierName = rawPropModifierName ? rawPropModifierName[1] : propName;

    const rawPropModifierValue = propName.match(regPropModifierValue);
    const propModifierValue = rawPropModifierValue ? rawPropModifierValue[1] : propValue;

    return {
        propModifierName,
        propModifierValue,
    };
};

