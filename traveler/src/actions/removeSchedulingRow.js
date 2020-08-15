export default function removeSchedulingRow(id) {
    console.log(id)
    return { type: 'REMOVE_SCHEDULING', id }
}