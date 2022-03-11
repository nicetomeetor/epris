export default (value) => {
    return {
        key: 'status',
        value: stringToBoolean(value)
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