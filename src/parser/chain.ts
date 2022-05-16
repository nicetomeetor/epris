export const chainElementKeys = (
    element: any,
    state: any,
) => {
    const data = element.data;
    const keys = element.keys;

    let chainedData = state[data];

    keys.forEach((key: string) => {
        chainedData = chainedData[key];
    });

    return chainedData;
};

export const chainElementsKeys = (
    elements: any,
    state: any,
) => elements.map((element: any) => chainElementKeys(element, state));