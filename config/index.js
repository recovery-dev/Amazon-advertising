const db = require('./db');
const merchants = require('./merchants');

module.exports = {
    token_url: 'https://api.amazon.com/auth/o2/token',
    ad_url: 'https://advertising-api.amazon.com',
    client_id : 'amzn1.application-oa2-client.79700b2ae79b4ae48f45afdec2003770',
    client_secret : '51f70490ddb246385606d613a44794616de5d6f60e0112b3ba2b9f5310e344ff',
    refresh_token: 'Atzr|IwEBIKZdw0J9vGuqVfp3gJWhV2uy4GHM_nVHBND7FWXxRLvxqa4NmQxqDFyzYlDmlrENRpElXftL5cucMj1TgoxPEKs37mozL8p6hUzxaa-_BtBknlWiYzeoC8DogOlO-RF7iNggq0fBbz7ZAdcqzt6eL3wqzi3UhVojvxzl1k5aSYRkp8DQqp5SqRyeW-WtZVpD9W8a8s5ut61YbPho8edejoVQEPR9Or6UEHlYxk1az2XbIlBg9CC3nLEOBFlbPqP5uKM90DrUWLIVbdGkbyk5Cz8QRYeAN1zLo1GGXzN8OVsbdXMbiF8OyfoRMJn0d1B3eU3uXvgbLbgqmQQuJVKHpJv3sg9OiAIeW99YdxcXtDnwn2BCDlSfCe5-TGd5qSND9w27-tlt6d3jmpOHoB5sbnpjVYXMPl3WbmaRkSn9cgdtaza1vvw4wbhHMn3tg1TVzzh7EUAj3K5PhrkDEVRIxbxkQ6-ikjBrVRnbMuFI8IhQ_0G0f4xWlKmcwchHwfLrecNBirgzSHcsHIgNQVPCskyucT62UJXTKRgWSqdZKBDG3Dnl1--TgEeyjBr8proMQecc7blx3iq2KGYgEMVoNwHZ',
    access_token: '',
    metricsForAds: 'campaignId,sku,currency,attributedConversions1d,attributedConversions1dSameSKU,attributedUnitsOrdered1d,attributedSales1dSameSKU,attributedSales1d',
    metricsForKeywords: 'campaignId,keywordText,attributedConversions1d,attributedConversions1dSameSKU,impressions,clicks,cost,attributedUnitsOrdered1d,attributedSales1dSameSKU,attributedSales1d',
    reportTypeForAds: 'productAds',
    reportTypeForKeywords: 'keywords',
    campaignType : 'sponsoredProducts',
    redirect_uri: 'https://www.commercelabs.co/about',
    host : 'https://www.commercelabs.co',
    token_type: 'bearer',
    db: db,
    merchants: merchants
}