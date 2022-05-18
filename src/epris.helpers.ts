import Epris from './epris';

export const defineActionProperties = (context: Epris) => {
    Object
        .entries(context.actions)
        .forEach(([name, func]) => {
            context.actions[name] = func.bind(context);
            Object
                .defineProperty(context, name, {
                    enumerable: true,
                    value: func,
                });
        });
};

export const bindEffects = (context: Epris) => {
    Object
        .entries(context.effects)
        .forEach(([name, func]) => {
            context.effects[name] = func.bind(context);
        });
};

export const defineStateProperties = (context: Epris) => {
    Object
        .keys(context.state)
        .forEach((key) => {
            Object
                .defineProperty(context, key, {
                    enumerable: true,
                    get() {
                        return context.state[key];
                    },
                    set(newValue) {
                        context.state[key] = newValue;
                    },
                });
        });
};

export const removeAllChildNodes = (parent: any) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

export const detectBoolean = (str: string) => {
    switch (str) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return str;
    }
};

export const createFuncsObject = (
    names: string[],
    funcs: Function[],
): { [key: string]: Function } => {
    const result: { [key: string]: Function } = {};

    for (let i = 0; i < names.length; i++) {
        result[names[i]] = funcs[i];
    }

    return result;
};


