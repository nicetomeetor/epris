import {h, mount, patch} from "./epris.vdom";
import {reactive, watchEffect} from "./epris.reactivity";
import directiveObject from "./epris.directives";

export default function Epris(object) {
    const el = object.el;
    const data = object.data;

    const state = reactive(data);
    const node = document.getElementById(el);
    let parsedNode;

    watchEffect(() => {
        if(!parsedNode) {
            parsedNode = parse(node);
            mount(parsedNode, node, state);
            node.parentNode.replaceChild(parsedNode.$el, node);
        } else {
            const newNode = parse(node);
            patch(parsedNode, newNode, state);
            parsedNode = newNode;
        }
    })

    setTimeout(() => {
        state.status = false;
    }, 2000);

    setTimeout(() => {
        state.text = "not state";
    }, 4000);

    return {
        h,
        patch,
        mount,
        reactive,
        watchEffect,
        state
    };

    function parse(node) {
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
                const directive = directiveObject.make(propName, propValue, state);
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
};
