import { chainElementKeys } from '../parser/epris.parser';

export default (
    {
        rawValue,
        context,
        node,
    }: any,
) => {
    const state = context.state;
    node.innerText = chainElementKeys(rawValue, state);
}