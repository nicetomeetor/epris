import { chainElementKeys } from '../parser/chain';

export default (
    {
        rawValue,
        context,
        element,
    }: any,
) => {
    const state = context.state;
    element.innerText = chainElementKeys(rawValue, state);
}