import {h, patch, mount} from "./epris.vdom";
import {reactive, watchEffect} from "./epris.reactivity";

const parse = (node) => {
    const attributes = node.attributes;
    const n = attributes.length;
    const props = {};
    const children = node.children;

    for(let i = 0; i < n; i++) {
        props[attributes[i].name] = attributes[i].value;
    }

    if(children.length < 1) {
        return h(node.tagName, props, node.textContent || "")
    } else {
        let nodeChildren = []
        for(let i = 0; i < children.length; i++) {
            nodeChildren.push(parse(children[i]))
        }
        return h(node.tagName, props, nodeChildren)
    }
}

export default function Epris(
    el = 'app',
    data = {},
) {
    const state = reactive(data);
    const node = document.getElementById(el)
    const newNode = parse(node)

    mount(newNode, node)
    node.parentNode.replaceChild(newNode.$el, node)

    return {
        h,
        patch,
        mount,
        reactive,
        watchEffect,
        state
    };
};
