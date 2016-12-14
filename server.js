'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const querystring = require('querystring');
const _ = require('lodash');
const port = process.env.PORT || 9527;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/getImage', (req, res) => {

    request(_.get(req, 'query.url', ''), (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let $ = cheerio.load(body);
            let img = $("#title-overview-widget > div.minPosterWithPlotSummaryHeight > div.poster > a > img").attr('src');
            res.json({imgUrl: img});
        } else {
            res.end();
        }
    });
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

app.listen(port, () => {
    console.log('Listening on port', port);
});