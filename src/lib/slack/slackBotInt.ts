
export interface BotAction {
    action: string;
    callBack:string;
    variables: Map<string,any>;
}

export interface SlackBotRules {
    name: string;
    description: string;
    commands: Array<BotCommands>;
}

export interface BotCommands {
    action: string;
    phrase: string;
    callBack: Function;
}