import { chainElementKeys, mutateNode } from '../epris.parser';

export default ({ rawValue, context, node }: any) => {

    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state);

    const sibling = node.nextElementSibling;
    const parent = node.parentElement;

    if (parsedValue) {
        if (sibling.hasAttribute('e-else')) {
            parent.removeChild(sibling);
        }
    } else {
        parent.removeChild(node);
    }

    sibling.removeAttribute('e-else');
    mutateNode(parent, context);
}