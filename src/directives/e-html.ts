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
) => {
    const state = context.state;
    element.innerHTML = chainElementKeys(rawValue, state);
}