export default (value, state) => {
    console.log(state[value], value)
    return {
        key: 'children',
        value: state[value] || value
    }
}