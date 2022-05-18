import {
    parseArgs,
    parseDirective,
    parseEvent,
} from './parse';

import {
    chainElementsKeys,
} from './chain';

import {
    attachEvent,
} from '../epris.events';

import {
    useDirective,
} from '../epris.directives';

import {
    createFuncsObject,
} from '../epris.helpers';

const updateOn = (
    {
        propValue,
        context,
        propName,
        element,
    }: any,
) => {
    const actions = context.actions;
    const state = context.state;

    const {
        args,
        action,
    } = parseEvent(propValue);

    const handler: EventListener = actions[action];

    const chainedArgs = chainElementsKeys(
        parseArgs(args),
        state,
    );

    attachEvent(
        element,
        propName,
        handler,
        chainedArgs,
    );
};

const updateDirective = (
    {
        propValue,
        context,
        element,
        propName,
        propModifierName,
        propModifierValue,
    }: any,
) => {
    const parsedDirective = parseDirective(propValue);

    useDirective(
        propModifierName,
        {
            rawValue: parsedDirective,
            element,
            context,
            propModifierValue,
            propModifierName,
            propName,
        },
    );
};

const updateNames: string[] = [
    'directive',
    'event',
];

const updateFuncs: Function[] = [
    updateDirective,
    updateOn,
];

const updates: { [key: string]: Function } = createFuncsObject(
    updateNames,
    updateFuncs,
);

export const useUpdateFunc = (
    key: string,
    data: any,
) => {
    const propName = data.propName;
    const element = data.element;

    element.removeAttribute(propName);

    updates[key](data);
};