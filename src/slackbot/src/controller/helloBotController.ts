import {APIGatewayEvent, APIGatewayProxyHandler} from "aws-lambda";
import {HelloBot} from "../bot/helloBot";
import {SlackPayload} from "@slackBotLib/slack/slackEvent";

// Create your instance of the bot
const bot: HelloBot = new HelloBot();

/*
    This is specialized call into your bot. Broken out to make it easier to unit test. This will
    also largely remain generic.
 */

export async function processSlackEvent() {

    try {
        await bot.processRequest();
    } catch (e) {
        // Send a generic error message back to Slack.
        await bot.error(e);
    }
}

/*
   This is the main entry point for your lambda function. This is generic for all bots.
 */

export const main: APIGatewayProxyHandler = async (event: APIGatewayEvent, _context) => {
    console.info("I got a message");
    let slackPayload: SlackPayload = await bot.extractPayload(event);

    // Don't process messages from other bots.
    if (slackPayload.event.bot_id === undefined) {
        await processSlackEvent();
    }

    /*
        Slack API requires that you return the body back to the Slack API.
     */

    return {
        statusCode: 200,
        body: event.body,
    };
};
