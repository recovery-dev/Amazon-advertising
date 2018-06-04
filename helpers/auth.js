const request = require('request');
const config = require('../config')

module.exports = () => {
    return new Promise((resolve, reject) => {
        const params = {
            'grant_type': 'refresh_token',
            'refresh_token': config.refresh_token,
            'client_id': config.client_id,
            'client_secret': config.client_secret,
            'redirect_uri': config.redirect_uri
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'charset': 'UTF-8'
        }
        request({
            url: config.token_url,
            method: "POST",
            json: params
        }, (err, httpResponse, body) => {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    })
}