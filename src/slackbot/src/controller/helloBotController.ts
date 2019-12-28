import {APIGatewayEvent, APIGatewayProxyHandler} from "aws-lambda";
import {HelloBot} from "../bot/helloBot";
import {SlackPayload} from "@slackBotLib/slack/slackEvent";

// Create your instance of the bot
const bot: HelloBot = new HelloBot();

/*
    This is specialized call into your bot. Broken out to make it easier to unit test. This will
    also largely remain generic.
 */

export async function processSlackEvent(slackPayload: SlackPayload) {

    try {
        await bot.processRequest(slackPayload);
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

    console.info(slackPayload);

    await processSlackEvent(slackPayload);

    /*
        Slack API requires that you return the body back to the Slack API.
     */

    return {
        statusCode: 200,
        body: event.body,
    };
};
