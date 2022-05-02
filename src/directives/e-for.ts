import { mutateNode, parse } from '../epris.parser';
import { VirtualNode } from '../epris.types';
import { regExpFor } from '../epris.regexp';

export default (
    {
        context,
        node,
        rawValue,
        propName,
        propModifierName
    }: any
) => {
    const actions = context.actions;
    const state = context.state;

    const split = rawValue.data.match(regExpFor);

    const key = split[1];
    const arrayKey = split[2];
    const array = state[arrayKey];

    const parent = node.parentElement;

    array.forEach((element: any) => {
        const clone = node.cloneNode(true);
        const loopState = {};

        Object.defineProperty(loopState, key, {
            value: element,
            writable: true,
            enumerable: true,
            configurable: true,
        });

        Object.assign(loopState, context.state)

        const loopContext = {
            state: loopState,
            actions
        }

        mutateNode(clone, loopContext)
        parent.appendChild(clone);
    });

    parent.removeChild(node);
}