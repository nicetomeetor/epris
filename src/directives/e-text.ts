import { chainElementKeys } from '../parser/chain';

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