import { State } from '../epris.types';
import { parseDirective, chainElementKeys} from '../epris.parser';

export default (value: string, state: State) => {
    const parsedValue = chainElementKeys(parseDirective(value), state)
    return {
        key: 'status',
        // value: state[value] !== undefined ? state[value] : !stringToBoolean(value)
        value: parsedValue
    }
}

const stringToBoolean = (str: string) => {
    switch(str.toLowerCase().trim()){
        case "true":
            return true;

        case "false":
        case null:
            return false;

        default:
            return Boolean(str);
    }
}