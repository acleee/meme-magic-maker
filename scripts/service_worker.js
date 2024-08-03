/* global chrome */
/**
 * This isn't actually where the magic happens, the magic's in the rules JSON :P
 */

/**
 * This is only used for debugging (to see if the rules are working).
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function (o) {
  console.log('rule matched:', o);
}); 
*/

 
/**
 * Turn the extension on.
 */

const turnOn = function turnExtensionOn() {

  chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ["meme_rules"]});
	
  chrome.action.setIcon({
    path: {
      19: '/icon128_on.png',
      38: '/icon128_on.png',
    },
  });

  chrome.storage.local.set({'cors_reject': 'true'});
};

/**
 * Turn the extension off.
 */
const turnOff = function turnExtensionOff() {
  chrome.declarativeNetRequest.updateEnabledRulesets({disableRulesetIds: ["meme_rules"]});  
  chrome.action.setIcon({
    path: {
      19: '/icon128_off.png',
      38: '/icon128_off.png',
    },
  });
  chrome.storage.local.set({'cors_reject': 'false'});
};

/**
 * Turn on the extension on install and startup.
 */
chrome.runtime.onInstalled.addListener(() => {
  turnOn();
});
chrome.runtime.onStartup.addListener(() => {
  turnOn();
});


/**
 * Toggle the extension when the toolbar icon is clicked.
 */
chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get(["cors_reject"]).then((result) => {	
  if (result.cors_reject === 'true') {
    turnOff();
  } else {
    turnOn();
  }

})
});

/**
 * Handle message asking if enabled.
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text === 'isOn') {
  chrome.storage.local.get(["cors_reject"]).then((result) => {	
	  
    sendResponse(result.cors_reject);
  })
  }
});
