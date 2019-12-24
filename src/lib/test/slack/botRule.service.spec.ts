import {expect} from "chai";
import {BotAction, BotRuleService} from "../../slack/botRuleService";
import {SlackBotRules} from "../../slack/slackBot";

describe("BotRule Service Test", function () {
    let botRuleService: BotRuleService;
    let slackBotRules: SlackBotRules;

    before(() => {
        botRuleService = new BotRuleService();

        slackBotRules = {
            name: "Example Bot",
            description: "These rules are for testing the bot rule engine",
            commands: [
                {
                    action: "test",
                    callBack: null,
                    phrase: "This is a [testVariable] of the rulesEngine."
                },
                {
                    action: "test2",
                    callBack: null,
                    phrase: "This is another [testVariable] rule."
                }
            ]
        }
    });

    it("Success if lexer finds correct number of tokens without quotes", function () {
        let tokens: Array<string> = botRuleService.lex("This is a testVariable of the rulesEngine.");
        expect(tokens.length).to.eq(7);
    });

    it("Success if lexer finds correct number of tokens within quoted text", function () {
        let tokens: Array<string> = botRuleService.lex("This is a \"quoted phrase variable\" of the rulesEngine.");
        expect(tokens.length).to.eq(7);
    });

     it("Success if lexer text finds correct number of tokens within block quoted text", function () {
         let tokens: Array<string> = botRuleService.lex("This is a “quoted phrase variable“ of the rulesEngine.");
         expect(tokens.length).to.eq(7);
     });

    it("Success if correct action determined from string", function () {
        let slackAction: BotAction = botRuleService.parser(botRuleService.lex("This is a example of the rulesEngine"), slackBotRules);

        expect(slackAction.action).to.eq("test");
        expect(slackAction.variables.get("testVariable")).to.eq("example");
    });

    it("Success if parser unable to find any matching action", function () {
        let slackAction: BotAction = botRuleService.parser(botRuleService.lex("This will find nothing"), slackBotRules);
        expect(slackAction.action).to.eq("ActionNotDefined");
        expect(slackAction.variables.size).to.eq(0);
    });

    it("Parser test should pass with .", function () {
        let slackAction: BotAction = botRuleService.parser(botRuleService.lex("This is a example of the rulesEngine."), slackBotRules);
        expect(slackAction.action).to.eq("test");
        expect(slackAction.variables.get("testVariable")).to.eq("example");
    });

    it("Parser test should pass with !", function () {
        let slackAction: BotAction = botRuleService.parser(botRuleService.lex("This is a example of the rulesEngine!"), slackBotRules);
        expect(slackAction.action).to.eq("test");
        expect(slackAction.variables.get("testVariable")).to.eq("example");
    });

    it("Parser test should pass with ?", function () {
        let slackAction: BotAction = botRuleService.parser(botRuleService.lex("This is a example of the rulesEngine?"), slackBotRules);
        expect(slackAction.action).to.eq("test");
        expect(slackAction.variables.get("testVariable")).to.eq("example");
    });

});