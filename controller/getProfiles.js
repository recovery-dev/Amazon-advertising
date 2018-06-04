const request = require('request');
const config = require('../config');

module.exports = (headers, id='') => {
    return new Promise((resolve, reject) => {
        request({
            url: config.ad_url + '/v1/profiles/' + id.toString(),
            method: "GET",
            headers: headers
        }, (err, httpResponse, body) => {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    })
}