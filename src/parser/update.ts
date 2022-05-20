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

import {
    ActionData,
    Actions,
    ChainData,
    State,
    UpdateData,
} from '../epris.types';

import {
    Element,
} from '../epris.interfaces';

const updateOn = (
    {
        propValue,
        context,
        propName,
        element,
    }: UpdateData,
): void => {
    const actions: Actions = context.actions;
    const state: State = context.state;

    const {
        args,
        action,
    }: ActionData = parseEvent(propValue);

    const handler: EventListener = actions[action];

    const chainedArgs: any[] = chainElementsKeys(
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
    }: UpdateData,
): void => {
    const rawValue: ChainData = parseDirective(propValue);

    useDirective(
        propModifierName,
        {
            rawValue,
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
    data: UpdateData,
): void => {
    const propName: string = data.propName;
    const element: Element = data.element;

    element.removeAttribute(propName);

    updates[key](data);
};