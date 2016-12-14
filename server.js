'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const querystring = require('querystring');
const _ = require('lodash');
const config = require('config');

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

app.listen(app.get('port'), () => {
    console.log('Listening on port', app.get('port'));
});