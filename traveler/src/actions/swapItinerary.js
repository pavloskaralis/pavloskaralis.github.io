export default function swapItinerary(itinerary, index) {
    return { type: 'SWAP_ITINERARY', itinerary, index }
}