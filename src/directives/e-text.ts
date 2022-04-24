import { chainElementKeys } from '../epris.parser';

export default ({rawValue, context}: any) => {
    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state)

    return {
        key: 'children',
        value: String(parsedValue)
    };
}