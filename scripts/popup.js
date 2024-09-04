document.addEventListener('DOMContentLoaded', function ()
{
    const toggleButton = document.getElementById('toggleButton');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const linksContainer = document.getElementById('links');
    const passwordsContainer = document.getElementById('passwords');

    // Set the initial button text based on the current state
    chrome.storage.local.get('cors_reject', (result) =>
    {
        toggleButton.textContent = result.cors_reject === 'true' ? 'Running' : 'Stopped';
        toggleButton.classList.add(result.cors_reject === 'true' ? 'on' : 'off');
    });

    toggleButton.addEventListener('click', () =>
    {
        chrome.runtime.sendMessage({ action: 'toggle' }, (response) =>
        {
            if (response.status === 'on')
            {
                toggleButton.textContent = 'Running';
                toggleButton.classList.remove('off');
                toggleButton.classList.add('on');
            }
            else if (response.status === 'off')
            {
                toggleButton.textContent = 'Stopped';
                toggleButton.classList.remove('on');
                toggleButton.classList.add('off');
            }
        });
    });

    // Tab switching logic
    tabs.forEach(tab =>
    {
        tab.addEventListener('click', () =>
        {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-target')).classList.add('active');
        });
    });

    // Fetch and display links.json (This should be fetched remotely rather than local in the extension)
    fetch(chrome.runtime.getURL('example_cfg/links.json'))
        .then((response) => response.json())
        .then((links) =>
        {
            links.forEach((link) =>
            {
                const linkElement = document.createElement('div');
                linkElement.className = 'link';
                linkElement.innerHTML = `
                <a href="${link.url}" target="_blank">${link.title}</a>
                <div>
                    <div>${link.current_stream}</div>
                    <button class="tune-in" data-url="${link.url}">Tune-In</button>
                </div>
            `;
                linksContainer.appendChild(linkElement);
            });

            // Add event listeners for the tune-in divs
            document.querySelectorAll('.tune-in').forEach(tuneIn =>
            {
                tuneIn.addEventListener('click', (event) =>
                {
                    const url = event.target.getAttribute('data-url');
                    if (url)
                    {
                        window.open(url, '_blank');
                    }
                });
            });
        });

    // Fetch and display passwords.json (This should be fetched remotely rather than local in the extension)
    fetch(chrome.runtime.getURL('example_cfg/passwords.json'))
        .then((response) => response.json())
        .then((passwords) =>
        {
            passwords.forEach((password) =>
            {
                const passwordElement = document.createElement('div');
                passwordElement.className = 'password';
                passwordElement.innerHTML = `<div>${password.section != "sixera" ? password.section + ".memesyndicate.com" : password.section}</div> <div>${password.password}</div>`;
                passwordsContainer.appendChild(passwordElement);
            });
        });
});
