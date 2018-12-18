const db = require('./db');
const merchants = require('./merchants');

module.exports = {
    token_url: 'https://api.amazon.com/auth/o2/token',
    ad_url: 'https://advertising-api.amazon.com',
    client_id : '',
    client_secret : '',
    refresh_token: '',
    access_token: '',
    metricsForAds: 'campaignId,sku,currency,attributedConversions1d,attributedConversions1dSameSKU,attributedUnitsOrdered1d,attributedSales1dSameSKU,attributedSales1d',
    metricsForKeywords: 'campaignId,keywordText,attributedConversions1d,attributedConversions1dSameSKU,impressions,clicks,cost,attributedUnitsOrdered1d,attributedSales1dSameSKU,attributedSales1d',
    reportTypeForAds: 'productAds',
    reportTypeForKeywords: 'keywords',
    campaignType : 'sponsoredProducts',
    redirect_uri: '',
    host : '',
    token_type: 'bearer',
    db: db,
    merchants: merchants
}
