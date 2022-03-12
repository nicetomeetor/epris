export default (value, state) => {
    return {
        key: 'children',
        value: state[value] || value
    }
}