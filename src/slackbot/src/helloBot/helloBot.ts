import {SlackBot} from "@slackBotLib/slack/slackBot";
import {BotAction, SlackBotRules} from "@slackBotLib/slack/slackBotInt";

/*
    A simple demonstration class to show how to write a bot. Your
    bot must extend the SlackBotService class.
 */

export class HelloBot extends SlackBot {

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

    /*
        This is the callback that is invoked whenever say [phrase] is seen by the bot.
     */

    private static async speak(helloBot: HelloBot, botAction: BotAction) : Promise<void> {
        return await helloBot.postMessage(SlackBot.getUser().user.name + " " +  botAction.variables.get("phrase"));
    }


}