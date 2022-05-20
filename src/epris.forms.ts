import { VirtualNode } from './epris.types';

enum ElementType {
    INPUT = 'INPUT',
    TEXTAREA = 'TEXTAREA',
    SELECT = 'SELECT',
}

const controlledTags = [
    ElementType.INPUT,
    ElementType.TEXTAREA,
    ElementType.SELECT,
];

export interface ControlledElement extends HTMLElement {
    checked: boolean,
    value: string,
}


const findType = (node: VirtualNode) => {
    const {
        props,
        el,
    } = node;

    const controlledElement = (<ControlledElement>(el));

    if (props.type === 'checkbox') {
        controlledElement.checked = props.checked;
    } else {
        controlledElement.value = props.value;
    }
};

export const control = (node: VirtualNode) => {
    const tag = node.tag;

    if (controlledTags.includes(tag as ElementType)) {
        findType(node);
    }
};
