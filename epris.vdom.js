const r = (tag, props, children) => {
    return {
        tag,
        props, 
        children
    };
};

const mount = (node, container) => {
    const {tag, props, children} = node;

    const el = document.createElement(tag);

    node.$el = el;

    for(const key in props) {
        el.setAttribute(key, props[key]);
    }

    if(typeof children == "string") {
        el.textContent = children;
    } else {
        children.forEach(child => {
            mount(child, el);
        });
    }

    container.appendChild(el);
};

const unmount = (node) => {
    node.$el.parentNode.removeChild(node.$el)
}

const patch = (node, newNode) => {

}