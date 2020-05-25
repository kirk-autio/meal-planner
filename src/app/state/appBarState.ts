export interface IAppBarState {
    title: string;
    isOpen: boolean;
}

export const initialState: IAppBarState = {
    title: "My Meal Planner"
    , isOpen: true
}