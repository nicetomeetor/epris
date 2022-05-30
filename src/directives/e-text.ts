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
        element,
    }: UpdateData,
): void => {
    const state = context.state;
    element.innerText = chainElementKeys(rawValue, state);
}