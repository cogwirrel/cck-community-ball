var CONFIG = {
    // This is the url that the community ball site calls to get pledge info etc.
    API_BASE_URL: "http://dev.ccca2016-auction.com/lite/v1",

    // Shamelessly sniffed from requests made by the above site
    CCK_EVENT_ID: "c80fce30-16cb-11e6-a2df-bc764e08e432",

    // The interval in milliseconds at which to poll pledge info
    POLL_INTERVAL: 1000,

    // These config options should match the filenames in the img folder
    IMAGE: {
        PREFIX: "test_",
        EXTENSION: ".png",
        PERCENTAGES_AVAILABLE: [0, 50, 100], // (in ascending order)
    },

    // Money values in pounds
    MONEY: {
        TARGET: 506500,
        ALREADY_RAISED: 217532,
    },
};

// Call the api for the CCK community ball event
var getForCCKEvent = function(url, data, success, fail) {
    return $.get(
        CONFIG.API_BASE_URL + "/events/" + CONFIG.CCK_EVENT_ID + url,
        data,
        success,
        fail
    );
};

// Gets the pledges!
var getPledges = function(success, fail) {
    return getForCCKEvent("/pledges", {}, success, fail);
};

// Return the appropriate image name given a total raised and target
var selectImage = function(total, target) {
    // Percentage as integer between 0 and 100
    var percentage = Math.round(total / target * 100);

    // Find the highest percentage available that's less than or equal to our calculated percentage
    var imagePercentage = CONFIG.IMAGE.PERCENTAGES_AVAILABLE[0];
    for(var i = 0; i < CONFIG.IMAGE.PERCENTAGES_AVAILABLE.length; i++) {
        if(CONFIG.IMAGE.PERCENTAGES_AVAILABLE[i] <= percentage) {
            imagePercentage = CONFIG.IMAGE.PERCENTAGES_AVAILABLE[i];
        } else {
            break;
        }
    }

    // Return the image name
    return CONFIG.IMAGE.PREFIX + String(imagePercentage) + CONFIG.IMAGE.EXTENSION;
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

            // Select the appropriate image given the total and the target
            var imageName = selectImage(totalPounds, CONFIG.MONEY.TARGET - CONFIG.MONEY.ALREADY_RAISED);

            // Update the image with the selected image url
            $('#indicator-image').attr('src', "img/" + imageName);
        }
    });
};

// Our entry point - called on startup
$(document).ready(function() {
    // Kick off the polling
    setInterval(poll, CONFIG.POLL_INTERVAL);
});
