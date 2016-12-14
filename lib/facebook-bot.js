'use strict';

const request = require('request');

var Bot = {};

Bot.callSendAPI = function (messageData) {
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

Bot.sendTextMessage = function (recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    };
    Bot.callSendAPI(messageData);
}

Bot.receivedAuthentication = function (event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfAuth = event.timestamp;

  var passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam, 
    timeOfAuth);

  Bot.sendTextMessage(senderID, "Authentication successful");
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
        Bot.callSendAPI(messageData);
    }
};

Bot.receivedMessage = function (event) {

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

module.exports = Bot;