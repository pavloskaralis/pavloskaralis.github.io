export default function swapPlanningRow(planning_row, id) {
    return { type: 'SWAP_PLANNING', planning_row, id }
}