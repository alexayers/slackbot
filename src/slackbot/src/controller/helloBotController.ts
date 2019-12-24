import {APIGatewayEvent, APIGatewayProxyHandler} from "aws-lambda";
import {HelloBot} from "../bot/helloBot";
import {SlackPayload} from "@slackBotLib/slack/slackEvent";

var helloBot : HelloBot = new HelloBot();

export async function processSlackEvent(slackPayload: SlackPayload) {

    console.log("Incoming Event ->" + slackPayload);

    try {
        await helloBot.processRequest(slackPayload);
    } catch (e) {
        console.log(e);
        await helloBot.error(e);
    }
}

export const main: APIGatewayProxyHandler = async (event: APIGatewayEvent, _context) => {
    let slackPayload: SlackPayload = helloBot.extractPayload(event);

    await processSlackEvent(slackPayload);

    return {
        statusCode: 200,
        body: event.body,
    };
};
