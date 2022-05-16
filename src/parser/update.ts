import {
    parseArgs,
    parseDirective,
    parseEvent,
} from './parse';

import { chainElementsKeys } from './chain';
import { attachEvent } from '../epris.events';
import { useDirective } from '../epris.directives';

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

    element.removeAttribute(propName);

    const { args, action } = parseEvent(propValue);
    const handler: EventListener = actions[action];
    const chainedArgs = chainElementsKeys(parseArgs(args), state);

    attachEvent(element, propName, handler, chainedArgs);
};

const updateDirective = (
    {
        propValue,
        context,
        node,
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
            node,
            context,
            propModifierValue,
            propModifierName,
            propName,
        },
    );
};

const updateFuncs: { [key: string]: Function } = {
    'directive': updateDirective,
    'event': updateOn,
};

export const useUpdateFunc = (
    key: string,
    data: any,
) => {
    const propName = data.propName;
    const node = data.node;

    node.removeAttribute(propName);

    updateFuncs[key](data);
};