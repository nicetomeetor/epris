import { State } from '../epris.types';

export default (value: string, state: State) => {
    return {
        key: 'children',
        value: state[value] !== undefined ? String(state[value]) : value
    }
}