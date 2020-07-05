export interface IUserState {
    token: string
    email: string
    displayName: string
    loading: boolean
    error: string
}

export const loggedOutUser: IUserState = {
    token: ""
    , email: ""
    , displayName: ""
    , loading: false
    , error: ""
}

export class UserState implements IUserState {

    constructor(token: string, displayName: string, email: string) {
        this.token = token;
        this.displayName = displayName;
        this.email = email;
    }

    public readonly token: string;
    public readonly email: string;
    public readonly displayName: string;
    public loading: boolean = false;
    public error: string = "";
}