import { State } from '../epris.types';

export default (value: string, state: State) => {
    return {
        key: 'status',
        value: state[value] !== undefined ? !state[value] : !stringToBoolean(value)
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