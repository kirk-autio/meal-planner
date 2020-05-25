export interface IAction<T, P> {
    readonly type: T;
    readonly payload?: P;
}

export const makeAction = <T, P>(type: T) => (payload: P) => {
    return { type, payload }
}

export function createAction<T extends string, P>(type: T, payload: P): IAction<T, P> {
    return { type, payload };
}

interface IStringMap<T> {
    [key: string]: T
}

type IAnyAction = (...args: any[]) => any;
export type IActionUnion<A extends IStringMap<IAnyAction>> = ReturnType<A[keyof A]>;
