import Epris from './epris';
import config from './epris.config';

const prefix = config.prefix + 'on:';

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

export const removeAllChildNodes = (parent: any) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
export const bindEffects = (context: Epris) => {
    Object
        .entries(context.effects)
        .forEach(([name, func]) => {
            // console.log(func)
            // @ts-ignore
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

export const stringToBoolean = (str: string) => {
    switch (str.toLowerCase().trim()) {
        case 'true':
            return true;

        case 'false':
        case null:
            return false;

        default:
            return Boolean(str);
    }
};

