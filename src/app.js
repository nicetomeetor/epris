import {h, mount, patch} from "./epris.vdom";
import {reactive, watchEffect} from "./epris.reactivity";
import directiveObject from "./epris.directives";
import eventsObject from "./epris.events"

export default class Epris {

    constructor(object) {
        const el = object.el;
        const data = object.data;
        const methods = object.methods;

        this.methods = this.bindMethods(methods);



        // setTimeout(() => {
        //     methods.addNumber();
        // }, 1000);

        this.state = reactive(data);

        const node = document.getElementById(el);
        let parsedNode;

        watchEffect(() => {
            if(!parsedNode) {
                parsedNode = this.parse(node);
                mount(parsedNode, node);
                node.parentNode.replaceChild(parsedNode.$el, node);
            } else {
                const newNode = this.parse(node);
                patch(parsedNode, newNode);
                parsedNode = newNode;
            }
        })

        // setTimeout(() => {
        //     this.state.status = false;
        // }, 2000);

        // setTimeout(() => {
        //     this.state.text = "not state";
        // }, 4000);
    }

    bindMethods(methods) {
        Object.entries(methods)
            .forEach(([name, func]) => {
                methods[name] = func.bind(this)
            });
        return methods;
    }

    parse(node) {
        const attributes = node.attributes;
        const n = attributes.length;
        const props = {};
        let children = node.children;

        const parseObject = {
            status: false,
            children: ""
        };

        for(let i = 0; i < n; i++) {
            const propName = attributes[i].name;
            const propValue = attributes[i].value;
            if(eventsObject.check(propName)) {
                if(!Object.keys(props).includes('on')) {
                    props.on = {};
                }
                const event = propName.slice(5, propName.length)
                Object.defineProperty(props.on, event, {
                    value: this.methods[propValue],
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else if(directiveObject.check(propName)) {
                const directive = directiveObject.make(propName, propValue, this.state);
                parseObject[directive.key] = directive.value;
            } else {
                props[propName] = propValue;
            }
        }

        if(parseObject.status) {
            return null;
        }

        if(parseObject.children.length) {
            children = [];
        }

        if(children.length < 1) {
            if (parseObject.children.length) {
                return h(node.tagName, props, parseObject.children);
            }
            return h(node.tagName, props, node.textContent || "");
        } else {
            const nodeChildren = [];
            for(let i = 0; i < children.length; i++) {
                const parsed = this.parse(children[i]);
                if(parsed) {
                    nodeChildren.push(parsed);
                }
            }
            return h(node.tagName, props, nodeChildren);
        }
    }
};
