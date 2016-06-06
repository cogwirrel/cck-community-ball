var CONFIG = {
    // These will need to be changed for the event!
    API_HOST: "dev.ccca2016-auction.com",
    EVENT_ID: "c80fce30-16cb-11e6-a2df-bc764e08e432",

    // These probably won't need to change!
    API_PROTOCOL: "http",
    API_PATH: "/lite/v1",

    // The interval in milliseconds at which to poll pledge info
    POLL_INTERVAL: 300,

    // Money values in pounds
    MONEY: {
        TARGET: 506500,
        ALREADY_RAISED: 217532,
    },
};

// Stuff used for demo version :)
var DEMO = {
    isDemo: false,
    fraction: 0
};

// Call the api for the CCK community ball event
var getForCCKEvent = function(url, data, success, fail) {
    return $.get(
        CONFIG.API_PROTOCOL + "://" + CONFIG.API_HOST + CONFIG.API_PATH + "/events/" + CONFIG.EVENT_ID + url,
        data,
        success,
        fail
    );
};

// Gets the pledges!
var getPledges = function(success, fail) {
    return getForCCKEvent("/pledges", {}, success, fail);
};

// Called every POLL_INTERVAL milliseconds
var poll = function() {
    getPledges(function(data) {
        // We've got some pledge data!
        if(data.entity) {
            // Get the total raised in for the cck community ball event
            var totalPence = 0;

            for(var i = 0; i < data.entity.length; i++) {
                totalPence += data.entity[i].total;
            }

            // Calculate the total raised in pounds as the values from the api are in pence
            var totalPounds = totalPence / 100;
            var target = CONFIG.MONEY.TARGET - CONFIG.MONEY.ALREADY_RAISED;

            // Fraction of raised money over target
            var fraction = totalPounds / target;

            // Some code to show off the slidey functionality!
            if(DEMO.isDemo) {
                DEMO.fraction += 0.01;
                if(DEMO.fraction > 1) {
                    DEMO.fraction = 0;
                }
                fraction = DEMO.fraction;
            }

            // Modify to be within the bounds of the glowing roof section
            // Min at about 25% and max at about 92%
            var cckPercentage = 25 + (92 - 25) * fraction;

            // Update the width of the splitter
            document.getElementById('splitter').style.width = cckPercentage + "%";
        }
    });
};

var getGetParams = function() {
    var queryDict = {};
    location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});
    return queryDict;
};

// Our entry point - called on startup
$(document).ready(function() {
    // Go into demo mode if required
    var getParams = getGetParams();
    if(getParams.hasOwnProperty('demo')) {
        DEMO.isDemo = true;
    }

    // Kick off the polling
    setInterval(poll, CONFIG.POLL_INTERVAL);
});
