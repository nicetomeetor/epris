import { State } from '../epris.types';
import { chainElementKeys, parseDirective } from '../epris.parser';

export default (value: string, state: State) => {
    const parsedValue = chainElementKeys(parseDirective(value), state)

    return {
        key: 'children',
        // value: state[value] !== undefined ? String(state[value]) : value
        value: String(parsedValue)
    }
}