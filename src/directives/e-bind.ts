import {
    chainElementKeys,
} from '../parser/chain';

import {
    UpdateData,
} from '../epris.types';

export default (
    {
        rawValue,
        context,
        propModifierValue,
        element,
        propName,
    }: UpdateData,
) => {
    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state);

    element.removeAttribute(propName);
    element.setAttribute(propModifierValue, parsedValue);
}