import {
    chainElementKeys,
} from '../parser/chain';

import {
    mutate,
    parseDirective,
} from '../parser/parse';

import {
    regExpFor,
} from '../epris.regexp';

import {
    removeAllChildNodes,
} from '../epris.helpers';

import {
    UpdateData,
} from '../epris.types';

export default (
    {
        context,
        element,
        propValue,
    }: UpdateData,
): void => {
    const state = Object.assign({}, context.state);

    const clone = element.cloneNode(true);

    const split = propValue.match(regExpFor);
    const key = split[1];
    const rawArray = split[2];

    const array = chainElementKeys(
        parseDirective(rawArray),
        state,
    );
    const n = (array).length;

    const parent = element.parentElement;

    for (let i = 0; i < n; i++) {
        const loopClone = clone.cloneNode(true);

        state[key] = array[i];

        const loopContext = {
            ...context,
            state,
        };

        mutate(
            loopClone as HTMLElement,
            loopContext,
        );

        parent.insertBefore(
            loopClone,
            element,
        );
    }

    removeAllChildNodes(element);
    parent.removeChild(element);
}