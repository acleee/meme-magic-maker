/* global chrome */
/**
 * Hides the origin so Aclee streams work.
 */

/**
 * Modifies the request to hide the origin / referrer.
 * @param {Object} details The details of the request to modify.
 */
const handleRequestHeaders = function handleRequestHeaders(details) {
  // Ignore none-memesyndicate requests and non-m3u8 and non-ts files.
  const origin = details.initiator || details.originUrl;
  
  if (origin.indexOf('memesyndicate') < 0 || (details.url.indexOf('.m3u8') < 0 && details.url.indexOf('.ts') < 0)) {
    return { requestHeaders: details.requestHeaders };
  }

  // Hide the origin & referrer.
  for (let i = 0; i < details.requestHeaders.length; i += 1) {
    const header = details.requestHeaders[i];
    if (header.name.toLowerCase() === 'origin' || header.name.toLowerCase() === 'referrer') {
      details.requestHeaders.splice(i, 1);
      console.log(`Hid the ${header.name}.`);
    }
  }

  return { requestHeaders: details.requestHeaders };
};

/**
 * Modifies the response to add the necessary CORS header.
 * @param {Object} details The details of the response to modify.
 */
const handleResponseHeaders = function handleResponseHeaders(details) {
  // Ignore non-m3u8 and non-ts files.
  if (details.url.indexOf('.m3u8') < 0 && details.url.indexOf('.ts') < 0) {
    return { responseHeaders: details.responseHeaders };
  }

  // If the header exists, change it to '*' and return.
  for (let i = 0; i < details.responseHeaders.length; i += 1) {
    const header = details.responseHeaders[i];
    if (header.name.toLowerCase() === 'access-control-allow-origin') {
      header.value = '*';
      console.log('Modified the CORS header.');
      return { responseHeaders: details.responseHeaders };
    }
  }

  // If the header does not exist, create it.
  details.responseHeaders.push(
    {
      name: 'Access-Control-Allow-Origin',
      value: '*',
    },
  );

  console.log('Added the CORS header.');
  return { responseHeaders: details.responseHeaders };
};

/**
 * Turn the hiding on.
 */
const turnOn = function turnBypassingOn() {
  chrome.browserAction.setIcon({
    path: {
      19: 'icon128_on.png',
      38: 'icon128_on.png',
    },
  });

  chrome.webRequest.onBeforeSendHeaders.addListener(
    handleRequestHeaders,
    {
      urls: ['<all_urls>'],
      types: ['xmlhttprequest'],
    },
    ['blocking', 'requestHeaders'],
  );

  chrome.webRequest.onHeadersReceived.addListener(
    handleResponseHeaders,
    {
      urls: ['<all_urls>'],
      types: ['xmlhttprequest'],
    },
    ['blocking', 'responseHeaders'],
  );

  localStorage.setItem('cors_reject', '1');
};

/**
 * Turn the hiding off.
 */
const turnOff = function turnBypassingOff() {
  chrome.browserAction.setIcon({
    path: {
      19: 'icon128_off.png',
      38: 'icon128_off.png',
    },
  });

  chrome.webRequest.onBeforeSendHeaders.removeListener(handleRequestHeaders);

  chrome.webRequest.onHeadersReceived.removeListener(handleResponseHeaders);

  localStorage.setItem('cors_reject', '');
};

/**
 * Turn on the origin hiding on install.
 */
chrome.runtime.onInstalled.addListener(() => {
  turnOn();
});

/**
 * Turn the hiding on/off when the icon is clicked.
 */
chrome.browserAction.onClicked.addListener(() => {
  if (localStorage.getItem('cors_reject')) {
    turnOff();
  } else {
    turnOn();
  }
});
