var YUI = require('yui3').YUI;

var scraper = module.exports = function scraper(uname) {
    console.log('TweetScraper: Id is '+uname);
    this.uname = uname;
}

scraper.prototype.getTweets = function(callback){
    var uname = this.uname;
    YUI().use('event','node','yql','json',function(Y){
        console.log('TweetScraper: user name is '+uname);
        var q = 'select * from twitter.user.timeline where (id = "'+uname+'")';
        Y.YQL(q, function(rawYqlData) {
            Y.log('YQL callback execution started');
            Y.log(rawYqlData);
            if (!rawYqlData.query.results) {
                callback([]);
                return;
            }
            var rawTweets = rawYqlData.query.results.statuses.status,
                rawTweet = null
                tweets = [],
                tweet = null,
                i=0;

            for (; i<rawTweets.length; i++) {
                rawTweet = rawTweets[i];
                var title = rawTweet.text;
                title = title.replace(/[@]+[A-Za-z0-9-_]+/g, function(f, n, s) {
                    return '<a href="http://twitter.com/' + f.replace('@', '') + '">' + f + '</a>';
                });
                title = title.replace(/[#]+[A-Za-z0-9-_]+/g, function(f, n, s) {
                    return '<a href="http://twitter.com/search?q=' + f.replace('#', '%23') + '">' + f + '</a>';
                });
                tweet = {
                    id: rawTweet.id,
                    text: title
                };
                tweets.push(tweet);
            }
            Y.log('calling callback with tweets');
            Y.log(tweets);
            callback(tweets);
        });
        return true;
    });
}
