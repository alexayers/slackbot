import {SlackBotRules} from "./slackBot";

export interface BotAction {
    action: string;
    callBack:string;
    variables: Map<string,any>;
}

export class BotRuleService {

    public lex(message: string): string [] {
        let tokens: Array<string> = [];
        let token: string = "";
        let quote: boolean = false;

        for (let i = 0; i < message.length; i++) {
            let ch = message[i];

            if (ch === " " && !quote) {
                if (token !== "") {
                    tokens.push(token);
                }

                token = "";
            } else if (ch === "\"" || ch === "“") {
                quote = !quote;
            } else {
                token += ch;
            }
        }

        if (token !== "") {
            tokens.push(token.replace("”",""));
        }

        return tokens;
    }

    public parser(tokens: Array<string>, slackBotRules: SlackBotRules): BotAction {
        let slackAction: BotAction;
        let operands: Map<string, any> = new Map<string, any>();
        let matches: number = 0;
        let bestMatch: number = -1;
        let selectedCommandIdx: number = -1;

        for (let i = 0; i < slackBotRules.commands.length; i++) {
            let phrase: Array<string> = this.lex(slackBotRules.commands[i].phrase);

            for (let j = 0; j < tokens.length; j++) {

                if (phrase[j] === tokens[j]) {
                    matches++;
                }
            }

            if (matches > bestMatch && matches != 0) {
                bestMatch = matches;
                selectedCommandIdx = i;
            }

            matches = 0;
        }

        if (selectedCommandIdx != -1) {
            let phrase: Array<string> = this.lex(slackBotRules.commands[selectedCommandIdx].phrase);

            for (let j = 0; j <= tokens.length; j++) {

                if (phrase[j] !== tokens[j]) {

                    if (tokens[j] === undefined) {
                        return {
                            action : "ActionNotDefined",
                            callBack : null,
                            variables : new Map<string, any>()
                        };
                    }

                    operands.set(phrase[j].replace("[", "").replace("]", ""), tokens[j]);
                }
            }

            slackAction = {
                action : slackBotRules.commands[selectedCommandIdx].action,
                callBack : null,
                variables : operands
            };
        } else {
            slackAction = {
                action : "ActionNotDefined",
                callBack : null,
                variables : new Map<string, any>()
            };
        }

        return slackAction;
    }


}