export const makeAction = <T, P>(type: T) => (payload: P) => {
    return { type, payload }
}

interface IStringMap<T> {
    [key: string]: T
}

type IAnyAction = (...args: any[]) => any;
export type IActionUnion<A extends IStringMap<IAnyAction>> = ReturnType<A[keyof A]>;
