export default (value, state) => {
    return {
        key: 'status',
        value: state[value] !== undefined ? !state[value] : !stringToBoolean(value)
    }
}

const stringToBoolean = (str) => {
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