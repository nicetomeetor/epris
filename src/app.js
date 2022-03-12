import {h, mount, patch} from "./epris.vdom";
import {reactive, watchEffect} from "./epris.reactivity";
import directiveObject from "./epris.directives";

export default function Epris(object) {

    const el = object.el;
    const data = object.data;
    const methods = object.methods;

    for(let [key, value] of Object.entries(methods)) {
        methods[key] = value.bind(this)
    }

    setTimeout(() => {
        methods.addNumber();
    }, 1000);

    this.state = reactive(data);

    const parse = (node) => {
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
            if(directiveObject.check(propName)) {
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
                const parsed = parse(children[i]);
                if(parsed) {
                    nodeChildren.push(parsed);
                }
            }
            return h(node.tagName, props, nodeChildren);
        }
    }


    const node = document.getElementById(el);
    let parsedNode;

    watchEffect(() => {
        if(!parsedNode) {
            parsedNode = parse(node);
            mount(parsedNode, node,this.state);
            node.parentNode.replaceChild(parsedNode.$el, node);
        } else {
            const newNode = parse(node);
            patch(parsedNode, newNode, this.state);
            parsedNode = newNode;
        }
    })

    setTimeout(() => {
        this.state.status = false;
    }, 2000);

    setTimeout(() => {
        this.state.text = "not state";
    }, 4000);



    return {
        h,
        patch,
        mount,
        reactive,
        watchEffect,
        state: this.state
    };


};
