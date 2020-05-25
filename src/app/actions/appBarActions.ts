export enum AppBarEvents {
    TOGGLE_MENU = "SITE_APP_BAR/TOGGLE_MENU"
}
export interface ToggleAction {
    type: AppBarEvents;
}

export function toggleAppBar() : ToggleAction {
    return {
        type: AppBarEvents.TOGGLE_MENU
    }
}

export type AppBarActionTypes = ToggleAction;
