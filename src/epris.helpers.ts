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
}

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
}

