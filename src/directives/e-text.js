export default (value, state) => {
    return {
        key: 'children',
        value: state[value] !== undefined ? String(state[value]) : value
    }
}