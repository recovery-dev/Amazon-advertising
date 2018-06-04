const express = require('express')
const app = express();
const request = require('request');
const moment = require('moment');
const fs = require('fs')
const path = require('path')
const url = require('url');
const http = require('http');
const zlib = require('zlib');
const getProfiles = require('./controller/getProfiles');
const getReport = require('./controller/getReport');
const createReport = require('./controller/createReport');
const config = require('./config')
const auth = require('./helpers/auth');
const cron = require('./helpers/cron');
const db = require('./helpers/database');

const downloadReport =  async function(reportId, type, headers, profile) {
    const report = await getReport(reportId, type, headers);
    console.log(report)
    const file = JSON.parse(report);
    if (file.code) {
        return false;
    }
    request({
        url: file.location,
        method: 'GET',
        followAllRedirects: true,
        headers: {
            'Authorization': headers.Authorization,
            'Amazon-Advertising-API-Scope': headers['Amazon-Advertising-API-Scope'],
            'Allow': 'GET, HEAD, PUT, DELETE',
        }
    }, (err, response, body) => {
        if (err) {
            return false;
        }
        const fileURL = response.request.uri.href;
       
        const r = request(fileURL);
        const file_name = url.parse(fileURL).pathname.split('/').pop();
        r.on('response', function (res) {
            // res.pipe(fs.createWriteStream('./download/' + file_name));
            const gunzip = zlib.createGunzip();
            const buffer = [];
            res.pipe(gunzip);
            gunzip.on('data', function (data) {
                buffer.push(data.toString())
            }).on("end", function () {
                // Get date created
                const query = "SELECT * FROM clabDevelopment.Reports WHERE report_id LIKE " + "'%" + reportId + "%'";
                db.query(query, (err, result) => {
                    if (err) return saveReports(err);
                    if (result && result.length > 0) {
                        const info = {
                            profile: profile.accountInfo,
                            type: type,
                            createdAt: result[0].created_at
                        };
                        return saveReports(null, buffer.join(""), info);
                    } else {
                        return false;
                    }
                })
            }).on("error", function (e) {
                return false;
            })
        });
    })
}

async function getReports(tokens, reportId, type) {
    
    if (tokens && typeof tokens === 'object') {
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': config.token_type + ' ' + tokens.access_token,
            'Amazon-Advertising-API-Scope': '',
        };
        // const type = 'keyword';
        // const type = 'productAds';
        const data = await getProfiles(headers)
        const profiles = JSON.parse(data);
        profiles.forEach((profile, key) => {
            headers['Amazon-Advertising-API-Scope'] = profile.profileId;
            // const reportId = 'amzn1.clicksAPI.v1.p7.5B0FB34D.40737bac-c3e7-469b-b036-07e940947f59';
            downloadReport(reportId, type, headers, profile);
        })
    }
}

const createReports = (startDate, endDate=moment().format('YYYYMMDD')) => {
    let date = moment(startDate).format('YYYYMMDD');
    let index = 0;
    do {
        report(date);
        index++;
        date = moment(startDate).add(index, 'days').format('YYYYMMDD');
    } while(date.indexOf(moment(endDate).add(1, 'days').format('YYYYMMDD')) == -1)
}

async function report(reportDate = moment().format('YYYYMMDD')) {
    const tokens = await auth();
    if (tokens && typeof tokens === 'object') {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${config.token_type} ${tokens.access_token}`,
            'Amazon-Advertising-API-Scope': '',
        };

        const data = await getProfiles(headers)
        const profiles = JSON.parse(data);

        const reportParam = {
            campaignType: config.campaignType,
            segment: "query",
            reportDate: reportDate,
            metrics: config.metricsForKeywords
        };

        profiles.forEach(async profile => {
            headers['Amazon-Advertising-API-Scope'] = profile.profileId;
            const reportId = 'amzn1.clicksAPI.v1.p7.5B0C022F.eda21426-5fbf-4f33-9921-87ff4a0d262a';
            const res = await createReport(reportParam, config.reportTypeForKeywords, headers);
            if (res) {
                if (typeof res === 'object') {
                    console.log(res);
                    let query = "INSERT INTO clabDevelopment.Reports (report_id, record_type, status, status_details, created_at) VALUES (";
                    query += "'" + res.reportId + "','" + res.recordType + "','" + res.status + "','" + res.statusDetails + "','" + reportDate + "')";
                    db.query(query, (err, result) => {
                        if (err) throw err;
                        return {
                            status: 200,
                            data: result
                        };
                    })
                }
            } else {
                console.log('Error')
                return {
                    status: 400,
                    data: 'failed to create reports'
                }
            }
        })
    }
};

function saveReports(err, data, info) {
    if (err) {
        return {
            status: 400,
            data: err
        }
    }
    let reports = [];
    let account = info.profile.sellerStringId; // merchant id
    let country = info.profile.marketplaceStringId; // country
    const merchants = config.merchants;
    for (let item in merchants) {
        if (merchants[item]['marketplace_id'].indexOf(info.profile.marketplaceStringId) !== -1 
            && merchants[item]['merchant_id'].indexOf(info.profile.sellerStringId) !== -1
        ) {
            account = merchants[item]['company'];
            country = merchants[item]['country'];
        }
    }
    const type = info.type;
    const createdAt = info.createdAt;

    data = JSON.parse(data);
    let query = '';
    if (type.indexOf('keyword') !== -1) {
        query = 'INSERT INTO clabDevelopment.Campaigns_keyword_report (CampaignId,Date,Account,Country,Keyword,Impressions,Conversion_Any,Conversion_Same_Sku,PPC_Revenue_Same_Sku,PPC_Revenue_Any,Clicks,Spend,Orders) VALUES ?';
        data.forEach(item => {
            const report = [item.campaignId, createdAt, account, country, item.keywordText, item.impressions, item.attributedConversions1d, item.attributedConversions1dSameSKU, item.attributedSales1dSameSKU, item.attributedSales1d,item.clicks,item.cost,'orders'];
            reports.push(report);
        })
    } else {
        query = 'INSERT INTO clabDevelopment.Campaigns_product_ads (CampaignId,Date,Account,Country,SKU,Currency,Conversion_Any,Conversion_Same_Sku,Orders,PPC_Revenue_Same_Sku,PPC_Revenue_Any) VALUES ?';
        data.forEach(item => {
            const report = [item.campaignId, createdAt, account, country, item.sku, item.currency, item.attributedConversions1d, item.attributedConversions1dSameSKU, 'orders',item.attributedSales1dSameSKU, item.attributedSales1d];
            reports.push(report);
        })
    }
    if (reports.length > 0) {
        db.query(query, [reports], (err, result) => {
            if (err) {
                throw err;
            }
            const notification = "Number of rows of campaign inserted:" + result.affectedRows;
            return {
                status: 200,
                data: notification
            }
        })
    } else {
        return false;
    }
}

async function getReportIds() {
    const query = "SELECT * FROM clabDevelopment.Reports";
    const tokens = await auth();
    db.query(query, (err, result) => {
        result.forEach(async row => {
            if (row && row.report_id) {
                await getReports(tokens, row.report_id, row.record_type);
            }
        });
    })
}

getReportIds();


// createReports(new Date('04/5/2018'));