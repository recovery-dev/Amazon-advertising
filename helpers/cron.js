const CronJob = require('cron').CronJob;
const auth = require('./auth');
const config = require('../config');

const refreshToken = () => {
    auth().then(res => {
        config.access_token = res.access_token; 
    })
}

module.exports = new CronJob('1 1 * * * *', function() {
    refreshToken();
}, null, true, 'America/Los_Angeles');
