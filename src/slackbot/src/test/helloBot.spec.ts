import {HelloBot} from "../bot/helloBot";
import {
    SlackBlockType,
    SlackElementEnum,
    SlackElementType,
    SlackEventType,
    SlackPayload
} from "@slackBotLib/slack/slackEvent";
import {BotAction} from "@slackBotLib/slack/botRuleService";
import { expect } from "chai";


describe("HelloBot Test", function () {
    let helloBot: HelloBot;
    let slackPayload: SlackPayload;

    before(() => {
        helloBot = new HelloBot();

        slackPayload = {
            token: "abcd",
            team_id: "abcd",
            api_app_id: "abcd",
            type: "event_callback",
            event_id: "abcd",
            event_time: 1576850751,
            authed_users: ["ABCD"],
            event: {
                client_msg_id: "abcd-abcd-abcd-abcd",
                type: SlackEventType.APP_MENTION,
                text: "<@ABCD> this is a test",
                user: "ABCD",
                ts: "1576850751.006000",
                team: "ABCD",
                blocks: [{
                    type: SlackBlockType.RICH_TEXT,
                    block_id: "S=6",
                    elements: [{
                        type: SlackElementType.RICH_TEXT_SECTION,
                        elements: [{
                            type: SlackElementEnum.USER,
                            user_id: "ABCD"},
                            {
                                type: SlackElementEnum.TEXT,
                                text: "say \"Hello World!\""}]
                    }]
                }],
                channel: "ABCD",
                event_ts: "1576850751.006000"
            },

        }

    });

    it("Success when user types \"say [phrase]\"", async function () {
        let botAction : BotAction = helloBot.getBotAction(slackPayload);
        expect(botAction.action).to.eq("helloWorld");
        expect(botAction.variables.get("phrase")).to.eq("Hello World!");

    })

});