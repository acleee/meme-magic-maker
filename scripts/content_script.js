const installed = document.createElement('div');
installed.setAttribute('id', 'meme-magic-installed');
document.head.appendChild(installed);

chrome.storage.local.get(["cors_reject"]).then((result) => {	
  if (result.cors_reject === 'true') {
	const enabled = document.createElement('div');
	enabled.setAttribute('id', 'meme-magic-enabled');
	document.head.appendChild(enabled);
  }
})