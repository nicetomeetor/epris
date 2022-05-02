import { chainElementKeys } from '../epris.parser';

export default ({rawValue, context, node}: any) => {
    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state).toString();

    node.innerText = parsedValue;
}