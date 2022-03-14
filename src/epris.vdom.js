import events from "./epris.events";
import eventsObject from "./epris.events";
import directiveObject from "./epris.directives";

export const h = (tag, props, children) => {
    return {
        tag,
        props, 
        children
    };
};

export const mount = (node, container) => {
    const tag = node.tag;
    const props = node.props;
    const children = node.children;

    const on = props.on;

    const el = document.createElement(tag);

    if(on) {
        events.addEvents(el, on);
    }

    for(const key in props) {
        el.setAttribute(key, props[key]);
    }

    if(typeof children == "string") {
        el.textContent = children;
    } else {
        children
            .forEach(child => {
                mount(child, el);
            });
        }

    node.$el = el;
    container.appendChild(el);

    return node;
};

export const unmount = (node) => {
    node.$el.parentNode.removeChild(node.$el);
}

export const patch = (node, newNode) => {
    if(node.tag !== newNode.tag) {
        mount(newNode, node.$el.parentNode);
        unmount(node);
    } else {
        newNode.$el = node.$el;

        if(typeof newNode.children === "string") {
            newNode.$el.textContent = newNode.children;
        } else {
            while(newNode.$el.attributes.length > 0){
                newNode.$el.removeAttribute(newNode.$el.attributes[0].name);
            }

            for(const key in newNode.props) {
                newNode.$el.setAttribute(key, newNode.props[key]);
            }

            if(typeof node.children === "string") {
                newNode.$el.textContent = null;
                newNode.children.forEach(child => {
                    mount(child, newNode.$el);
                });
            } else {
                const minChildrenLength = Math.min(node.children.length, newNode.children.length);
                for(let i = 0; i < minChildrenLength; i++) {
                    patch(node.children[i], newNode.children[i]);
                }

                if(node.children.length > newNode.children.length) {
                    node.children.slice(newNode.children.length).forEach(child => {
                        unmount(child);
                    })
                }

                if(node.children.length < newNode.children.length) {
                    newNode.children.slice(node.children.length).forEach(child => {
                        mount(child, newNode.$el);
                    })
                }
            }
        }
    }
}

export const parse = (node, state, methods) => {
    const attributes = node.attributes;
    const n = attributes.length;
    const props = {};
    let children = node.children;

    const parseObject = {
        status: true,
        children: ""
    };

    for(let i = 0; i < n; i++) {
        const propName = attributes[i].name;
        const propValue = attributes[i].value;

        if(eventsObject.check(propName)) {
            const handler = methods[propValue];
            props.on = eventsObject.make(props, propName, handler);

        } else if(directiveObject.check(propName)) {
            const directive = directiveObject.make(propName, propValue, state);
            parseObject[directive.key] = directive.value;

        } else {
            props[propName] = propValue;
        }
    }

    if(!parseObject.status) {
        return [];
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
            const parsed = parse(children[i], state, methods);

            if(!Array.isArray(parsed)) {
                nodeChildren.push(parsed);
            }
        }
        return h(node.tagName, props, nodeChildren);
    }
}