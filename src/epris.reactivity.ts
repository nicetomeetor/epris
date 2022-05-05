let stateChangeEffect: Function = () => {};

export const watchEffect = (f: Function) => {
    stateChangeEffect = f;
    f();
};

let effects: any = {};

export const setEffects = (eff: any) => {
    effects = eff
}



export const reactive = (object: { [key: string]: any }, parent: any = null): Object => {
    // console.log(object)
    if (object === null || typeof object !== 'object') {
        return object;
    }


    for (const property in object) {
        object[property] = reactive(object[property], parent ? parent : property);
    }

    return new Proxy(object, {
        get(target, property) {
            return target[property as keyof typeof target];
        },

        set(target, property, value) {
            if (target[property as keyof typeof target] !== value) {
                target[property as keyof typeof target] = reactive(value, parent ? parent : property);
                stateChangeEffect()

                const effect = effects[parent ? parent : property]

                if (effect) {
                    effect()
                }
            }

            return true;
        },
    });
};