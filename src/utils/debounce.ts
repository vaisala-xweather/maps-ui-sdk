export const debounce = (callback: (...args: any[]) => void, delay = 300) => {
    let timerId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => callback(...args), delay);
    };
};
