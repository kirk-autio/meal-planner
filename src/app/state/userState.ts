export enum MessageType {
    All,
    Login,
    Registration
}
export interface IUserMessage {
    message: string;
    messageType: MessageType;
    getMessageFor(messageType: MessageType): string;
}

export class UserMessage implements IUserMessage {
    message: string;
    messageType: MessageType;
    
    constructor(message: string, messageType: MessageType = MessageType.All) {
        this.message = message;
        this.messageType = messageType;
    }
    
    getMessageFor(messageType: MessageType): string {
        return this.messageType === MessageType.All || this.messageType === messageType ? this.message : "";
    }
}

export interface IUserState {
    token: string;
    email: string;
    displayName: string;
    loading: boolean;
    message: IUserMessage;
    verified: boolean;
}

export const loggedOutUser: IUserState = {
    displayName: "",
    email: "",
    loading: false,
    message: new UserMessage(""),
    token: "",
    verified: false
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
    public message: IUserMessage = new UserMessage("");
    public verified: boolean = false;
}