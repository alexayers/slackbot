/*
    Wrappers to make it easier to deal with Slack payloads. Nothing terribly interesting.
 */

export interface SlackPayload {
    token: string,
    team_id: string,
    api_app_id: string,
    event: SlackEvent,
    type: string,
    event_id:string,
    event_time: number,
    authed_users: Array<string>
}

export enum SlackEventType {
    APP_MENTION = "app_mention"
}

export enum SlackBlockType {
    RICH_TEXT ="rich_text"
}

export enum SlackElementType {
    RICH_TEXT_SECTION = "rich_text_section"
}

export enum SlackElementEnum {
    USER = "user",
    LINK = "link",
    TEXT = "text"
}

export interface SlackElement {
    type: SlackElementEnum,
    user_id?: string,
    text?: string
}

export interface SlackBlockElement {
    type: SlackElementType,
    "elements": Array<SlackElement>
}

export interface SlackBlock {
    type: SlackBlockType,
    block_id: string,
    elements: Array<SlackBlockElement>
}

export interface SlackEvent {
    client_msg_id: string,
    type: SlackEventType,
    subtype?: string,
    bot_id?: string,
    text: string,
    user: string,
    ts: string,
    team: string,
    blocks: Array<SlackBlock>,
    channel: string,
    event_ts: string
}