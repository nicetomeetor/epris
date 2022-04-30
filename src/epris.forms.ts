import { VirtualNode } from './epris.types';

enum elementType {
    INPUT = 'INPUT',
    TEXTAREA = 'TEXTAREA',
    // SELECT = 'SELECT',
}

type ControlledElement = HTMLAreaElement | HTMLInputElement;

const findInputValueName = (node: VirtualNode) => {
    const type = node.props.type;

    switch (type) {
        case 'checkbox':
            return 'checked';
        default:
            return 'value';
    }
}

const findTextAreaValueName = () => {
    return "value";
}

const controlledTags = [
    elementType.INPUT,
    elementType.TEXTAREA,
    // 'SELECT',
];

const valueTypes = new Map<string, Function>([
    [elementType.INPUT, findInputValueName],
    [elementType.TEXTAREA, findTextAreaValueName]
]);

export const control = (node: VirtualNode) => {
    const tag = node.tag;
    const value = node.props.value;
    const type = node.props.type;

    if (controlledTags.includes(tag as elementType)) {
        const key: string = findInputValueName(node)
        (<any>(node.el))[] = value;
        // console.log(node.props)
    }
};

// const find

