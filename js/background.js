/*
 Allows to read, change and override settings kept in localStorage

 FIXME Can be replaced with chrome.storage.local as soon as http://crbug.com/178618 will be resolved
 FIXME Can be replaced with localStorage on the panel page as soon as http://crbug.com/319328 will be resolved
 */
chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  "use strict";

  if (message.name === 'getSettings') {
    callback(localStorage);
  } else if (message.name === 'setSettings') {
    localStorage = message.data;
  } else if (message.name === 'changeSetting') {
    localStorage[message.item] = message.value;
  } else {
    // Simply relay the request. This lets the various components of the extension talk.
    chrome.tabs.sendMessage(sender.tab.id, message, callback);
  }
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.id, {type: 'toggleBar'});
});
