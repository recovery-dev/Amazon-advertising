const request = require('request');
const config = require('../config');

module.exports = (reportId, type, headers) => {
    return new Promise((resolve, reject) => {
        request({
            url: config.ad_url + '/v1/reports/' + reportId,
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