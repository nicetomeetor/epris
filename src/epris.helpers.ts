import Epris from './epris';

export const defineActionProperties = (context: Epris): void => {
    Object
        .entries(context.actions)
        // .filter(([name, func]) => isFunc(func))
        .forEach(([name, func]) => {
            context.actions[name] = func.bind(context);
            Object
                .defineProperty(context, name, {
                    enumerable: true,
                    value: func,
                });
        });
};

export const bindEffects = (context: Epris): void => {
    Object
        .entries(context.effects)
        // .filter(([name, func]) => isFunc(func))
        .forEach(([name, func]) => {
            context.effects[name] = func.bind(context);
        });
};

export const defineStateProperties = (context: Epris): void => {
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

export const removeAllChildNodes = (parent: Element): void => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

export const detectBoolean = (str: string): string | boolean => {
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

export const isObject = (object: any) => typeof object === 'object' && object !== null;

const isFunc = (value: any) => typeof value === 'function';

export const filterFuncs = (object: any) => Object.fromEntries(Object.entries(object).filter(([_, func]) => isFunc(func)));


