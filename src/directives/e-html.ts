import { chainElementKeys } from '../epris.parser';

export default (
    {
        rawValue,
        context,
        node,
    }: any,
) => {
    const state = context.state;
    node.innerHTML = chainElementKeys(rawValue, state);
}