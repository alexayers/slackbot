import {APIGatewayEvent, APIGatewayProxyHandler, Context} from "aws-lambda";
import {HelloBot} from "./helloBot";
import {SlackPayload} from "@slackBotLib/slack/slackEvent";

/*
   This is the main entry point for your lambda function. This is generic for all bots with the exception
   of the instance of your bot on line 13.
 */

export const main: APIGatewayProxyHandler = async (event: APIGatewayEvent, _context : Context) => {

    // Create your instance of the bot
    const bot: HelloBot = new HelloBot();

    let slackPayload: SlackPayload = await bot.extractPayload(event);

    // Don't process messages from other bots.
    if (slackPayload.event.bot_id === undefined) {
        try {
            await bot.processRequest();
        } catch (e) {
            // Send a generic error message back to Slack.
            await bot.error(e);
        }
    }

     //   Slack API requires that you return the body back to the Slack API.

    return {
        statusCode: 200,
        body: event.body,
    };
};