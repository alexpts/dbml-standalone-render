export function throttle(fn: Function, timeoutMs: number, immediate: boolean = true) {
    let timer = 0

    return function perform(...args) {
        if (timer) return

        timer = setTimeout(() => {
            clearTimeout(timer)
            timer = 0
            !immediate && fn(...args)
        }, timeoutMs)

        immediate && fn(...args)
    }
}


export function debounce(fn: Function, timeoutMs: number, immediate: boolean = true, timeoutFn: undefined|Function = undefined) {
    let timer = 0;

    return function perform(...args) {
        const later = function() {
            clearTimeout(timer)
            timer = 0

            if (!immediate) {
                fn(...args)
            }

            timeoutFn && timeoutFn()
        }

        !timer && immediate && fn(...args);

        clearTimeout(timer);
        timer = setTimeout(later, timeoutMs);
    };
}