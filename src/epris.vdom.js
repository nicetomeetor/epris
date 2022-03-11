import directiveObject from "./epris.directives"

export const h = (tag, props, children) => {
    return {
        tag,
        props, 
        children
    };
};

export const mount = (node, container, state) => {
    const mountObject = {
        status: false,
        children: node.children
    }

    const tag = node.tag;
    const props = node.props;

    const el = document.createElement(tag);

    for(const key in props) {
        if(directiveObject.check(key)) {
            const directive = directiveObject.make(key, props[key], state);
            mountObject[directive.key] = directive.value;
            // el.setAttribute(key, directive.value);
        } else {
            el.setAttribute(key, props[key]);
        }
    }

    if(mountObject.status) {
        return
    }

    if(typeof mountObject.children == "string") {
        el.textContent = mountObject.children;
    } else {
        mountObject
            .children
            .forEach(child => {
                mount(child, el, state);
            });
        }

    node.$el = el;
    container.appendChild(el);

    return node
};

export const unmount = (node) => {
    node.$el.parentNode.removeChild(node.$el);
}

export const patch = (node, newNode, state) => {
    const mountObject = {
        status: false,
        children: node.children
    }

    if (node.tag !== newNode.tag) {
        mount(newNode, node.$el.parentNode, state);
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
                // newNode.$el.setAttribute(key, newNode.props[key]);
                // console.log(key)
                if(directiveObject.check(key)) {
                    const directive = directiveObject.make(key, newNode.props[key], state);
                    mountObject[directive.key] = directive.value;
                    newNode.$el.setAttribute(directive.key, directive.value);
                    // console.log(key)
                } else {
                    newNode.$el.setAttribute(key, newNode.props[key]);
                }
            }

            if(typeof node.children === "string") {
                newNode.$el.textContent = null;
                newNode.children.forEach(child => {
                    mount(child, newNode.$el, state);
                });
            } else {
                const minChildrenLength = Math.min(node.children.length, newNode.children.length);
                for(let i = 0; i < minChildrenLength; i++) {
                    patch(node.children[i], newNode.children[i], state);
                }

                if(node.children.length > newNode.children.length) {
                    node.children.slice(newNode.children.length).forEach(child => {
                        unmount(child);
                    })
                }

                if(node.children.length < newNode.children.length) {
                    newNode.children.slice(node.children.length).forEach(child => {
                        mount(child, newNode.$el, state);
                    })
                }
            }
        }
    }
}