let activeEffect;

export const watchEffect = (f) => {
    activeEffect = f;
    f();
    activeEffect = null;
}

class Dependency {
    constructor() {
        this.subscribers = new Set();
    }

    depend() {
        if(activeEffect) this.subscribers.add(activeEffect);
    }

    notify() {
        this.subscribers.forEach(subscriber => subscriber());
    }
}

export const reactive = (object) => {
    for(const property in object) {
        object[property] = reactive(object[property])
    }

    const dep = new Dependency();

    return new Proxy(object, {
        get(target, property) {
            dep.depend();
            return target[property];
        },
        set(target, property, value) {
            if(target[property] !== value) {
                dep.notify();
                target[property] = reactive(value);
            }

            return true;
        },
    });
};