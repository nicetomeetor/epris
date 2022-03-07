let activeEffect;

const watchEffect = (fn) => {
    activeEffect = fn;
    fn();
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

const reactive = (obj) => {
    Object.keys(obj).forEach((key) => {
        const dep = new Dependency();
        let value = obj[key];

        Object.defineProperty(obj, key, {
            get() {
                dep.depend();
                return value;
            },
            set(newValue) {
                if (newValue !== value) {
                    value = newValue;
                    dep.notify();
                }
            }
        })
    });
    return obj;
}