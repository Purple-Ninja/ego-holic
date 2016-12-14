'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const querystring = require('querystring');
const _ = require('lodash');
const config = require('config');
const fbot = require('./lib/facebook-bot');

// For Facebook Bot
const VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN || config.get('validationToken');
const APP_SECRET = process.env.MESSENGER_APP_SECRET || config.get('appSecret');
const PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN || config.get('pageAccessToken');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN)) {
  console.error('Missing config values');
  process.exit(1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 5000);

app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log('Validating webhook');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error('Failed validation. Make sure the validation tokens match.');
        res.sendStatus(403);
    }
});

app.post('/webhook', function (req, res) {
    var data = req.body;
    if (data.object == 'page') {
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            pageEntry.messaging.forEach(function(messagingEvent) {
                if (messagingEvent.optin) {
                    fbot.receivedAuthentication(messagingEvent);
                }
                else if (messagingEvent.message) {
                    fbot.receivedMessage(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });
    } else {
        res.sendStatus(404);
    }
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/getBestMoment', (req, res) => {
    var qs = querystring.stringify({ q: _.get(req, 'query.q', '') });
    var reqUrl = 'http://52.198.213.105/getBestMoment.php?'+qs;
    request(reqUrl, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            res.json(JSON.parse(body));
        } else {
            res.end();
        }
    });
});

app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'));
});