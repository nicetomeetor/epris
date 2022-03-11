export default (value) => {
    return {
        status: stringToBoolean(value)
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