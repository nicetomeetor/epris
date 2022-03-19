let activeEffect: Function;

export const watchEffect = (f: Function) => {
    activeEffect = f;
    f();
    activeEffect = null;
};

class Dependency {
    private subscribers: Set<Function>;

    constructor() {
        this.subscribers = new Set();
    }

    depend() {
        if (activeEffect) {
            this.subscribers.add(activeEffect);
        }
    }

    notify() {
        this.subscribers.forEach(subscriber => subscriber());
    }
}

export const reactive = (object: { [key: string]: any }): Object => {
    if (object === null || typeof object !== 'object') {
        return object;
    }

    for (const property in object) {
        object[property] = reactive(object[property]);
    }

    const dep = new Dependency();

    return new Proxy(object, {
        get(target, property) {
            dep.depend();
            return target[property as keyof typeof target];
        },

        set(target, property, value) {
            if (target[property as keyof typeof target] !== value) {
                target[property as keyof typeof target] = reactive(value);
                dep.notify();
            }

            return true;
        },
    });
};