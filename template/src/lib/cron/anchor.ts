
export function getCycleWindow(from: Date, now = new Date()) {
    const start = new Date(from)
    const end = new Date(from)
    end.setMonth(end.getMonth() + 1)
    return {start, end}
}