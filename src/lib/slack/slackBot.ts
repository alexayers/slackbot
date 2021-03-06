import axios, {AxiosInstance} from 'axios';
import {APIGatewayEvent} from "aws-lambda";
import {SlackElementEnum, SlackPayload} from "./slackEvent";
import {SlackUser} from "./slackUser";
import {BotRuleService} from "./botRuleService";
import {BotAction, SlackBotRules} from "./slackBotInt";

export class SlackBot {
    private _axiosInstance: AxiosInstance;
    private _botRuleService: BotRuleService;
    private _slackChannel: string;
    static _message: string;
    private static _slackUser: SlackUser;
    private readonly _slackBotRules: SlackBotRules;
    protected _callBacks: Map<string, Function> = new Map<string, Function>();

    constructor(slackBotRules: SlackBotRules) {
        this._axiosInstance = axios.create({timeout: 60000});
        this._axiosInstance.defaults.headers.common['Authorization'] = "Bearer " + process.env.slackSecret;
        this._slackBotRules = slackBotRules;
        this._botRuleService = new BotRuleService();

        if (slackBotRules != null) {
            for (let i = 0; i < this._slackBotRules.commands.length; i++) {
                this._callBacks.set(this._slackBotRules.commands[i].action, this._slackBotRules.commands[i].callBack);
            }
        }
    }

    public async processRequest() : Promise<void>  {
        let botAction: BotAction = this.getBotAction();
        await this._callBacks.get(botAction.action)(this, botAction);
    }

    /*
        Posts a message back to the slack channel from which the message originated.
     */

    async postMessage(text: string): Promise<any> {

        return await this._axiosInstance.post("https://slack.com/api/chat.postMessage", {
            channel: this._slackChannel,
            text: text
        });
    }

    async getSlackUser(userID: string) : Promise<void> {
        let response :any = await this._axiosInstance.get("https://slack.com/api/users.info?token=" + process.env.slackSecret + "&user=" + userID);
        SlackBot._slackUser = response.data;
        console.log(SlackBot._slackUser);
    }

    /*
        Extracts the slack specific event information from a Lambda Event/
     */

    async extractPayload(event: APIGatewayEvent): Promise<SlackPayload> {
        let body: any = event.body;
        let slackPayload: SlackPayload = JSON.parse(body) as SlackPayload;

        // This will be used to make sending the message back to Slack more straight forward.
        this._slackChannel = slackPayload.event.channel;
        await this.getSlackUser(slackPayload.event.user);

        slackPayload = SlackBot.simplifyMessage(slackPayload);

        return slackPayload;
    }

    /*
        Helper function to make it easier to deal with messages chatted directly at the bot.
     */

    private static simplifyMessage(slackPayload: SlackPayload): SlackPayload {
        let processedMessage: string = "";

        console.log(slackPayload);

        if (slackPayload.event.blocks[0] === undefined || slackPayload.event.blocks[0].elements[0] === undefined) {
            return slackPayload;
        }

        for (let i = 0; i < slackPayload.event.blocks[0].elements[0].elements.length; i++) {

            /*
                Ignoring users mentioned within the message to the bot. We are also doing this because if things like
                URLs and email addresses contain special formatting that the bot doesn't need to care about to process
                a message.
             */
            if (slackPayload.event.blocks[0].elements[0].elements[i].type != SlackElementEnum.USER) {
                processedMessage += slackPayload.event.blocks[0].elements[0].elements[i].text;
            }
        }

        SlackBot._message = processedMessage.trim();

        return slackPayload;
    }

    async error(e: any) : Promise<void> {
        console.error(e);
        this.postMessage("I'm sorry, I don't know how to handle that request.");
    }

    getMessage(): string {
        return SlackBot._message;
    }

    static getUser(): SlackUser {
        return SlackBot._slackUser;
    }

    getBotAction(): BotAction {
        return this._botRuleService.parser(this._botRuleService.lex(SlackBot._message), this._slackBotRules);
    }
}

