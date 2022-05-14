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


const findType = (node: VirtualNode) => {
    const { props, tag, el } = node;

    switch (tag as ElementType) {
        case ElementType.INPUT:
            const type = props.type;
            if (type === 'checkbox') {
                (<HTMLInputElement>(el)).checked = props.checked;
            } else {
                (<HTMLInputElement>(el)).value = props.value;
            }
            break;
        case ElementType.TEXTAREA:
            (<HTMLTextAreaElement>(el)).value = props.value;
            break;
        case ElementType.SELECT:
            (<HTMLSelectElement>(el)).value = props.value;
            break;
    }
};

export const control = (node: VirtualNode) => {
    const tag = node.tag;

    if (controlledTags.includes(tag as ElementType)) {
        findType(node);
    }
};
