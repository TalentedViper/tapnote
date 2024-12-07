export const filterByKey = (data, key, value) => {
    if (!data && !value) return data; // Return original data if no value is provided
    return data.filter(item =>
        item[key].toString().toLowerCase().includes(value.toLowerCase())
    );
}