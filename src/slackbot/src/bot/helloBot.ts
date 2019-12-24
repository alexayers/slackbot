import {SlackBotService} from "@slackBotLib/slack/slackBotService";
import {BotAction} from "@slackBotLib/slack/botRuleService";
import {SlackBotRules} from "@slackBotLib/slack/slackBot";


export class HelloBot extends SlackBotService {

    constructor() {
        super(HelloBot.getRules());
        console.log("Bot created");
    }

    public static getRules() : SlackBotRules {
        return {
            name: "HelloBot BOT",
            description: "These are the rules for the DHP bot",
            commands: [
                {
                    action: "helloWorld",
                    phrase: "say [phrase]",
                    callBack: HelloBot.speak
                }
            ]
        }
    }

    private static async speak(dhpBot: HelloBot, botAction: BotAction) {
        return await dhpBot.postMessage(botAction.variables.get("phrase"));
    }


}