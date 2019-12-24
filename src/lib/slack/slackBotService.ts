import axios, {AxiosInstance} from 'axios';
import {APIGatewayEvent} from "aws-lambda";
import {SlackElementEnum, SlackPayload} from "./slackEvent";
import {BotAction, BotRuleService} from "./botRuleService";
import {SlackBotRules} from "./slackBot";


export class SlackBotService {
    private _axiosInstance: AxiosInstance;
    private _botRuleService: BotRuleService;
    private _slackChannel: string;
    private _slackBotRules: SlackBotRules;
    protected _callBacks: Map<string, Function> = new Map<string, Function>();

    constructor(slackBotRules: SlackBotRules) {
        this._axiosInstance = axios.create({ timeout: 60000 });
        this._axiosInstance.defaults.headers.common['Authorization'] = "Bearer " + process.env.slackSecret;
        this._slackBotRules = slackBotRules;
        this._botRuleService = new BotRuleService();

        if (slackBotRules != null) {
            for (let i = 0; i < this._slackBotRules.commands.length; i++) {
                this._callBacks.set(this._slackBotRules.commands[i].action, this._slackBotRules.commands[i].callBack);
            }
        }
    }

    public async processRequest(slackPayload: SlackPayload) {
        let botAction: BotAction = this.getBotAction(slackPayload);
        return await this._callBacks.get(botAction.action)(this, botAction);
    }

    /*
        Posts a message back to the slack channel from which the message originated.
     */

    async postMessage(text: string) : Promise<any> {

        return  await this._axiosInstance.post("https://slack.com/api/chat.postMessage", {
            channel: this._slackChannel,
            text: text
        });
    }

    /*
        Extracts the slack specific event information from a Lambda Event/
     */

    extractPayload(event: APIGatewayEvent) : SlackPayload {
        let body : any = event.body;
        let slackPayload : SlackPayload = JSON.parse(body) as SlackPayload;
        this._slackChannel = slackPayload.event.channel;
        slackPayload = SlackBotService.simplifyMessage(slackPayload);

        return slackPayload;
    }

    /*
        Helper function to make it easier to deal with messages chatted directly at the bot.
     */

    private static simplifyMessage(slackPayload: SlackPayload) : SlackPayload {
        let processedMessage : string = "";

        for (let i = 0; i < slackPayload.event.blocks[0].elements[0].elements.length; i++) {
            if (slackPayload.event.blocks[0].elements[0].elements[i].type != SlackElementEnum.USER) {
                processedMessage += slackPayload.event.blocks[0].elements[0].elements[i].text;
            }
        }

        slackPayload.event.blocks[0].elements[0].elements[1].text = processedMessage;

        return slackPayload;
    }

    async error(e:any) {
        console.error(e);
        this.postMessage("I'm sorry, I don't know how to handle that request.");
    }

    getMessage(slackPayload: SlackPayload) : string {
        return slackPayload.event.blocks[0].elements[0].elements[1].text.trim();
    }

    getBotAction(slackPayload: SlackPayload) : BotAction {
        let message : string = this.getMessage(slackPayload);
        return this._botRuleService.parser(this._botRuleService.lex(message),this._slackBotRules);
    }
}
