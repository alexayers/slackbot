import {APIGatewayEvent, APIGatewayProxyHandler} from "aws-lambda";
import {HelloBot} from "../bot/helloBot";
import {SlackPayload} from "@slackBotLib/slack/slackEvent";

// Create your instance of the bot
var bot : HelloBot = new HelloBot();

/*
    This is specialized call into your bot. Broken out to make it easier to unit test. This will
    also largely remain generic.
 */

export async function processSlackEvent(slackPayload: SlackPayload) {

    try {
        await bot.processRequest(slackPayload);
    } catch (e) {
        console.log(e);
        await bot.error(e);
    }
}

/*
   This is the main entry point for your lambda function. This is generic for all bots.
 */

export const main: APIGatewayProxyHandler = async (event: APIGatewayEvent, _context) => {
    let slackPayload: SlackPayload = bot.extractPayload(event);

    await processSlackEvent(slackPayload);

    return {
        statusCode: 200,
        body: event.body,
    };
};
