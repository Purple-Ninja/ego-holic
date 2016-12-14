'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const querystring = require('querystring');
const _ = require('lodash');
const config = require('config');

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
                    receivedAuthentication(messagingEvent);
                }
                else if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });
    } else {
        res.sendStatus(404);
    }
});

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    };
    callSendAPI(messageData);
}

function receivedAuthentication(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfAuth = event.timestamp;

  var passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam, 
    timeOfAuth);

  sendTextMessage(senderID, "Authentication successful");
}

var BestMoment = {
    send: function (recipientId, message, messageType) {
        var elements = [
            {
              title: "Bacon Wrapped Dates Stuffed with Blue Cheese",
              subtitle: "new-year/appetizers",
              image_url: "https://i.ytimg.com/vi/pkC6NAvJlCE/hqdefault.jpg",
              buttons: [{
                type: "postback",
                title: "Awesome",
                payload: "#"
              }]
            },
            {
              title: "In the Mood for Love",
              subtitle: "90's-themed",
              image_url: "https://i.ytimg.com/vi/pkC6NAvJlCE/hqdefault.jpg",
              buttons: [{
                type: "postback",
                title: "Awesome",
                payload: "#"
              }]
            }
        ];
        var messageData = {
          recipient :{
              id: recipientId
          },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: "generic",
                elements: elements
              }
            }
          }
        };
        callSendAPI(messageData);
    }
};

function receivedMessage(event) {

  var senderID = event.sender.id;
  var sender = event.sender;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    BestMoment.send(senderID, messageText, 'text');
  } else if (messageAttachments) {
    BestMoment.send(senderID, messageAttachments, 'attachments');
  } else {
    // TODO
  }
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
    }
  });  
}



app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'));
});