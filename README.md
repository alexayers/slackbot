# Creating a SlackBot

1. Open slack
2. Select "Customize Slack" from the application menu
3. Select "Configure apps" from the sidebar menu
4. Select "Build" from the top nav bar
5. Click the "Start Building" button
6. Provide an App Name and a Development Slack Workspace, and click "Create App"
7. Under "Add features and functionality" select "Bots"
8. Click "Add a Bot User"
9. Provide a display name and default username for your bot and click "Add Bot User"


### OAuth & Permissions

You will need to install your application in order to get credentials needed for further steps.

1. Select "OAuth & Permissions"
2. Click "Install App to Workspace"
3. You will see a screen with the permissions requested, click "Allow"
4. Copy the OAuth Access Token
5. One the file <ProjectRoot>/src/slackbot/env/dev-us-east-2.yml.sample
6. Update the variable "slackSecret" with the Oauth Access Token
7. Rename this file to be <ProjectRoot>/src/slackbot/env/dev-us-east-2.yml

### Scopes

You will need to give your bot write permissions to your slack channel

1. Remaining on the OAuth & Permissions 
2. Click "Add an OAuth Scope"
3. Add the permission "chat:write:bot"
4. Click "Reinstall App"

### Deploy your Application

You will now want to deploy your app before you finish setting things up.

1. From terminal navigate to the directory <ProjectRoot>/src/slackbot
2. Run the deployment command: sls deploy --stage dev --region us-east-2
3. Once this finishes you should see a single endpoint, copy this end point. Example:  https://abcd12334.execute-api.us-east-2.amazonaws.com/dev/helloBot


### Event Subscriptions

In order for your bot to understand what is happening within Slack you'll need to enable Events

1. Select "Event Subscriptions" from the left menu
2. Toggle "Enable Events" to On
3. Paste the end point you copied into the "Request URL" field
4. This should return Verified with a checkmark

### Subscribe to bot events

You'll now want to subscribe events you want your bot to reply to when it sees them. A good one is "app_mention" which will cause your bot reply when someone @botname

1. Click "Add Bot User Event"
2. Add "app_mention"
3. Click "Save Changes"


