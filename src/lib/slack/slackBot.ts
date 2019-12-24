
export interface BotCommands {
    action: string;
    phrase: string;
    callBack: Function;
}

export interface SlackBotRules {
    name: string;
    description: string;
    commands: Array<BotCommands>;
}
