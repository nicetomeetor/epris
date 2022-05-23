import {
    Effects,
} from './epris.types';

import {
   isObject,
} from './epris.helpers'

let globalEffect: Function = () => {};

let effects: Effects = {};

export const watchGlobalEffect = (f: Function): void => {
    globalEffect = f;
};

export const watchEffects = (effs: Effects): void => {
    effects = effs;
};

export const reactive = (
    object: { [key: string]: any },
    parent: any = null,
): Object => {
    if (!isObject(object)) {
        return object;
    }

    for (const property in object) {
        object[property] = reactive(
            object[property],
            parent ? parent : property,
        );
    }

    return new Proxy(object, {
        get(target, property) {
            return target[property as keyof typeof target];
        },

        set(target, property, value) {
            if (target[property as keyof typeof target] !== value) {
                const parentValue = parent ? parent : property;

                target[property as keyof typeof target] = reactive(
                    value,
                    parentValue,
                );

                globalEffect();

                const effect = effects[parentValue];

                if (effect) {
                    effect();
                }
            }

            return true;
        },
    });
};