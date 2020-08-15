export default function swapSchedulingRow(scheduling_row, id) {
    return { type: 'SWAP_SCHEDULING', scheduling_row, id }
}