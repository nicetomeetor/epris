import { mutate } from '../parser/parse';
import { regExpFor } from '../epris.regexp';
import { removeAllChildNodes } from '../epris.helpers';

export default (
    {
        context,
        element,
        rawValue,
    }: any,
) => {
    const actions = context.actions;
    const state = context.state;
    const effects = context.effects;

    const clone = element.cloneNode(true);

    const split = rawValue.data.match(regExpFor);

    const key = split[1];
    const arrayKey = split[2];
    const array = state[arrayKey];

    const parent = element.parentElement;

    array.forEach((elem: any) => {
        const loopClone = clone.cloneNode(true);
        const loopState = {};

        Object.defineProperty(loopState, key, {
            value: elem,
            writable: true,
            enumerable: true,
            configurable: true,
        });

        Object.assign(loopState, context.state);

        const loopContext = {
            state: loopState,
            actions,
            effects,
        };

        mutate(loopClone, loopContext);

        parent.insertBefore(loopClone, element);
    });

    removeAllChildNodes(element);
    parent.removeChild(element);
}