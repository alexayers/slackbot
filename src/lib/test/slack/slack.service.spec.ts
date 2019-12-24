import {expect} from "chai";
import {SlackBotService} from "../../slack/slackBotService";
import {SlackPayload} from "../../slack/slackEvent";


describe("Slack Service Test", function () {
    let event: any;
    let slackService: SlackBotService;

    before(() => {
        slackService = new SlackBotService(null);

        event = {
            resource: '/helloBot',
            path: '/helloBot',
            httpMethod: 'POST',
            headers:
                {
                    Accept: '*/*',
                    'Accept-Encoding': 'gzip,deflate',
                    'CloudFront-Forwarded-Proto': 'https',
                    'CloudFront-Is-Desktop-Viewer': 'true',
                    'CloudFront-Is-Mobile-Viewer': 'false',
                    'CloudFront-Is-SmartTV-Viewer': 'false',
                    'CloudFront-Is-Tablet-Viewer': 'false',
                    'CloudFront-Viewer-Country': 'US',
                    'Content-Type': 'application/json',
                    Host: 'abcd.execute-api.us-east-2.amazonaws.com',
                    'User-Agent': 'Slackbot 1.0 (+https://api.slack.com/robots)',
                    Via: '1.1 abcd.cloudfront.net (CloudFront)',
                    'X-Amz-Cf-Id': 'abcd',
                    'X-Amzn-Trace-Id': 'Root=abcd',
                    'X-Forwarded-For': '127.0.0.1, 127.0.0.1',
                    'X-Forwarded-Port': '443',
                    'X-Forwarded-Proto': 'https',
                    'X-Slack-Request-Timestamp': '12345',
                    'X-Slack-Signature': 'v0=abcd'
                },
            multiValueHeaders:
                {
                    Accept: ['*/*'],
                    'Accept-Encoding': ['gzip,deflate'],
                    'CloudFront-Forwarded-Proto': ['https'],
                    'CloudFront-Is-Desktop-Viewer': ['true'],
                    'CloudFront-Is-Mobile-Viewer': ['false'],
                    'CloudFront-Is-SmartTV-Viewer': ['false'],
                    'CloudFront-Is-Tablet-Viewer': ['false'],
                    'CloudFront-Viewer-Country': ['US'],
                    'Content-Type': ['application/json'],
                    Host: ['abcd.execute-api.us-east-2.amazonaws.com'],
                    'User-Agent': ['Slackbot 1.0 (+https://api.slack.com/robots)'],
                    Via:
                        ['1.1 abcd.cloudfront.net (CloudFront)'],
                    'X-Amz-Cf-Id': ['abcd=='],
                    'X-Amzn-Trace-Id': ['Root=abcd'],
                    'X-Forwarded-For': ['127.0.0.1, 127.0.0.1'],
                    'X-Forwarded-Port': ['443'],
                    'X-Forwarded-Proto': ['https'],
                    'X-Slack-Request-Timestamp': ['123456'],
                    'X-Slack-Signature':
                        ['abcd']
                },
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            pathParameters: null,
            stageVariables: null,
            requestContext:
                {
                    resourceId: 'abcd',
                    resourcePath: '/helloBot',
                    httpMethod: 'POST',
                    extendedRequestId: 'abcd',
                    requestTime: '20/Dec/2019:14:05:52 +0000',
                    path: '/dev/dhpBot',
                    accountId: '123456789',
                    protocol: 'HTTP/1.1',
                    stage: 'dev',
                    domainPrefix: 'abcd',
                    requestTimeEpoch: 1576850752378,
                    requestId: 'abcd-1234-abcd-1234',
                    identity:
                        {
                            cognitoIdentityPoolId: null,
                            accountId: null,
                            cognitoIdentityId: null,
                            caller: null,
                            sourceIp: '127.0.0.1',
                            principalOrgId: null,
                            accessKey: null,
                            cognitoAuthenticationType: null,
                            cognitoAuthenticationProvider: null,
                            userArn: null,
                            userAgent: 'Slackbot 1.0 (+https://api.slack.com/robots)',
                            user: null
                        },
                    domainName: 'abcd.execute-api.us-east-2.amazonaws.com',
                    apiId: 'abcd'
                },
            body: '{"token":"abcd","team_id":"abcd","api_app_id":"abcd","event":{"client_msg_id":"abcd-abcd-abcd-abcd","type":"app_mention","text":"<@ABCD> this is a test","user":"ABCD","ts":"1576850751.006000","team":"ABCD","blocks":[{"type":"rich_text","block_id":"S=6","elements":[{"type":"rich_text_section","elements":[{"type":"user","user_id":"ABCD"},{"type":"text","text":" this is a test"}]}]}],"channel":"ABCD","event_ts":"1576850751.006000"},"type":"event_callback","event_id":"abcd","event_time":1576850751,"authed_users":["ABCD"]}',
            isBase64Encoded: false
        };

    });

    it("Success if user found", function () {
        let slackPayload: SlackPayload = slackService.extractPayload(event);
        expect(slackPayload.event.user).to.eq("ABCD");
    });

    it("Success if message extracted", function () {
        let slackPayload: SlackPayload = slackService.extractPayload(event);
        let message: string = slackService.getMessage(slackPayload);
        expect(message).to.eq("this is a test");
    });

});