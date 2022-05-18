import { chainElementKeys } from '../parser/chain';

export default (
    {
        rawValue,
        context,
        propModifierValue,
        element,
        propName,
    }: any,
) => {
    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state);

    element.removeAttribute(propName);
    element.setAttribute(propModifierValue, parsedValue);
}