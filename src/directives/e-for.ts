import { parse } from '../epris.parser';
import { VirtualNode } from '../epris.types';
import { regExpFor } from '../epris.regexp';

export default (
    {
        context,
        node,
        rawValue,
        propName
    }: any
) => {
    const clonedNode = node.cloneNode(true);

    const actions = context.actions;
    const state = context.state;

    const children: Array<VirtualNode> = [];
    const split = rawValue.data.match(regExpFor);

    const key = split[1];
    const arrayKey = split[2];
    const array = state[arrayKey];

    array.forEach((element: any) => {
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

        const parsed = parse(clonedNode, loopContext);
        children.push(parsed);
    });

    return {
        key: 'children',
        value: children,
    };
}