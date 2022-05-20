import {
    ChainData,
    State,
} from '../epris.types';

export const chainElementKeys = (
    element: ChainData,
    state: State,
): any => {
    const data: string = element.data;
    const keys: string[] = element.keys;

    let chainedData: any = state[data];

    keys.forEach((key: string) => {
        chainedData = chainedData[key];
    });

    return chainedData;
};

export const chainElementsKeys = (
    elements: Array<ChainData>,
    state: State,
): any[] => elements.map((element: ChainData) => chainElementKeys(element, state));