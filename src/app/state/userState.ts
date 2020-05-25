export interface IUserState {
    displayName: string
    username: string
    loading: boolean
    error: string
}

export const loggedOutUser: IUserState = {
    displayName: ""
    , username: ""    
    , loading: false
    , error: ""
}