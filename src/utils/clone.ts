export const deepClone = <T>(item: T, map: WeakMap<any, any> = new WeakMap()): T => {
    // Handle primitive types (null, undefined, numbers, strings, booleans)
    if (item === null || typeof item !== 'object') {
        return item;
    }

    if (item instanceof Date) {
        return new Date(item) as T;
    }

    if (Array.isArray(item)) {
        const arr = item.map((i) => deepClone(i, map));
        return arr as T;
    }

    if (item instanceof Object) {
        if (map.has(item)) {
            return map.get(item);
        }
        const clonedObj: Record<string, any> = {};
        map.set(item, clonedObj);

        Object.keys(item).forEach((key) => {
            clonedObj[key] = deepClone((item as any)[key], map);
        });

        return clonedObj as T;
    }

    // Handle functions and other non-clonable objects by returning them directly
    return item;
};
