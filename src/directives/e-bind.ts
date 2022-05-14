import { chainElementKeys } from '../epris.parser';

export default (
    {
        rawValue,
        context,
        propModifierValue,
        node,
        propName,
    }: any,
) => {
    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state);

    node.removeAttribute(propName);
    node.setAttribute(propModifierValue, parsedValue);
}