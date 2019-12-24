import {SlackBotService} from "@slackBotLib/slack/slackBotService";
import {BotAction} from "@slackBotLib/slack/botRuleService";
import {SlackBotRules} from "@slackBotLib/slack/slackBot";

/*
    A simple demonstration class to show how to write a bot. Your
    bot must extend the SlackBotService class.
 */

export class HelloBot extends SlackBotService {

    constructor() {
        super(HelloBot.getRules());
    }

    public static getRules() : SlackBotRules {
        return {
            name: "HelloBot BOT",
            description: "These are the rules for the Hello Bot",
            commands: [
                {
                    action: "helloWorld",       // Title of the action you want your bot to perform
                    phrase: "say [phrase]",     // The phrase required to trigger your action including any variables you want to use surrounded by square brackets
                    callBack: HelloBot.speak    // Callback function.
                }
            ]
        }
    }

    private static async speak(dhpBot: HelloBot, botAction: BotAction) {
        return await dhpBot.postMessage(botAction.variables.get("phrase"));
    }


}