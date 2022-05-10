import {
    chainElementKeys,
    mutate,
} from '../epris.parser';

export default (
    {
        rawValue,
        context,
        node,
    }: any,
) => {
    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state);

    const sibling = node.nextElementSibling;
    const parent = node.parentElement;

    const siblingStatus = sibling && sibling.hasAttribute('e-else');

    if (parsedValue) {
        if (siblingStatus) {
            parent.removeChild(sibling);
        }
    } else {
        parent.removeChild(node);
    }

    if (siblingStatus) {
        sibling.removeAttribute('e-else');
    }

    mutate(parent, context);
}