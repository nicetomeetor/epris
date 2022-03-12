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
    const children = node.children

    const el = document.createElement(tag);

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

    return node
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