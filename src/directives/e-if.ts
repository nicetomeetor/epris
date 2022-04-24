import { chainElementKeys } from '../epris.parser';

export default ({rawValue, context}: any) => {
    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state);

    return {
        key: 'status',
        value: parsedValue,
    };
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