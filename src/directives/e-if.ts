import { mutate } from '../parser/parse';
import { chainElementKeys } from '../parser/chain';

export default (
    {
        rawValue,
        context,
        element,
    }: any,
) => {
    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state);

    const sibling = element.nextElementSibling;
    const parent = element.parentElement;

    const siblingStatus = sibling && sibling.hasAttribute('e-else');

    if (parsedValue) {
        if (siblingStatus) {
            parent.removeChild(sibling);
        }
    } else {
        parent.removeChild(element);
    }

    if (siblingStatus) {
        sibling.removeAttribute('e-else');
    }

    mutate(parent, context);
}