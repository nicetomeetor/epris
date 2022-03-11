import {h, mount, patch} from "./epris.vdom";
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

export default function Epris(object) {
    const el = object.el
    const data = object.data

    const state = reactive(data);
    const node = document.getElementById(el)
    let parsedNode;

    watchEffect(() => {
        if(!parsedNode) {
            parsedNode = parse(node)
            mount(parsedNode, node, state)
            node.parentNode.replaceChild(parsedNode.$el, node)
        } else {
            // mount(parsedNode, node, state)
            // // const newNode = parse(document.getElementById(el))
            // patch(parsedNode, newNode, state);
            // // parsedNode = newNode;
            // // mount(parsedNode, node, state)
        }
    })

    setTimeout(() => {
        state.text = "2121fds1"
    }, 2000)

    return {
        h,
        patch,
        mount,
        reactive,
        watchEffect,
        state
    };
};
