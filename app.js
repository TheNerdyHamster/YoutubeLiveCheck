var request = require('request');

// Username to search for!
let username = "Lilahamstern";
// Api key for youtube api V3
let apiKey = "YourApiKeyHere";
// ChannelID youtube channel!
let channelD;

// Get channel id for channael given
function getChannelId(channelName) {
  request.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${apiKey}`, (_error, _res, body) => {
    let data = JSON.parse(body)
    if (data.error) {
      console.log("Reached the request limit!")
    } else {
      channelID = data.items[0].id.channelId
    }
  })
}

// Checks if channel is live
function checkIfChannelIsLive(id, username) {
  request.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&type=video&eventType=live&key=${apiKey}`, (_error, _res, body) => {
    let data = JSON.parse(body)
    if (data.pageInfo.totalResults != 1) {
      console.log(username + " is not live! Reciving last streams!")
      getChannelCompletedStreams(id, username)
    } else {
      console.log(username + " is live! Started " + data.items[0].snippet.publishedAt + "!")
    }
  })
}

// Searching for saved streams on channel
function getChannelCompletedStreams(id, username) {
  request.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&channelId=${id}&type=video&eventType=completed&key=${apiKey}`, (_error, _res, body) => {
    let data = JSON.parse(body)
    if (data.pageInfo.totalResults === 0) {
      console.log(username + " have never been live or saved old streams!")
    } else {
      console.log(username + " was last live: " + data.items[0].snippet.publishedAt + "!")
    }
  })
}


getChannelId(username)
// Timeout to make use ChannelID is not null (Shit javascript)
setTimeout(() => {
  if (channelID != null) {
    checkIfChannelIsLive(channelID, username)
  } else {
    console.log("Could not recive user id for " + username + "!")
  }
}, 3000)