import { chainElementKeys } from '../epris.parser';

export default ({ rawValue, context, propModifierValue }: any) => {
    const state = context.state;
    const parsedValue = chainElementKeys(rawValue, state);

    return {
        key: 'props',
        name: propModifierValue,
        value: parsedValue,
    };
}