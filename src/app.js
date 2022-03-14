import {mount, patch, parse} from "./epris.vdom";
import {reactive, watchEffect} from "./epris.reactivity";

export default class Epris {
    constructor(object) {
        const el = object.el;
        const data = object.data;
        const methods = object.methods;

        this.methods = this.bindMethods(methods);

        this.state = reactive(data);

        const node = document.getElementById(el);
        let parsedNode;

        watchEffect(() => {
            if(!parsedNode) {
                parsedNode = parse(node, this.state, this.methods);
                mount(parsedNode, node, this.methods);
                node.parentNode.replaceChild(parsedNode.$el, node);
            } else {
                const newNode = parse(node, this.state, this.methods);
                patch(parsedNode, newNode);
                parsedNode = newNode;
            }
        });
    }

    bindMethods(methods) {
        Object.entries(methods)
            .forEach(([name, func]) => {
                methods[name] = func.bind(this)
            });
        return methods;
    }
};
