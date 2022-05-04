let stateChangeEffect: Function = () => {};

export const watchEffect = (f: Function) => {
    stateChangeEffect = f;
    f();
};

const effects = () => {

}

export const reactive = (object: { [key: string]: any }): Object => {
    if (object === null || typeof object !== 'object') {
        return object;
    }

    for (const property in object) {
        object[property] = reactive(object[property]);
    }

    return new Proxy(object, {
        get(target, property) {
            return target[property as keyof typeof target];
        },

        set(target, property, value) {
            if (target[property as keyof typeof target] !== value) {
                target[property as keyof typeof target] = reactive(value);
                stateChangeEffect()
            }

            return true;
        },
    });
};