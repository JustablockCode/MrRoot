document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle.querySelector('.toggle-icon');
    const text = darkModeToggle.querySelector('.toggle-text');

    let modeSwitchCount = 0;
    let lastSwitchTime = Date.now();
    const MAX_SWITCHES = 20;
    const TIME_WINDOW = 10000; // 10 seconds in milliseconds

    if (localStorage.getItem('darkMode') === 'true') {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    function toggleDarkMode() {
        const currentTime = Date.now();

        if (currentTime - lastSwitchTime < TIME_WINDOW) {
            modeSwitchCount++;

            if (modeSwitchCount >= MAX_SWITCHES) {
                alert("Are you trying to get epilepsy? Maybe take a break from the light show! 😵💫");
                modeSwitchCount = 0; // Reset the count after showing the alert
            }
        } else {
            modeSwitchCount = 1; // Reset count if more than 10 seconds have passed
        }

        lastSwitchTime = currentTime;
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }

        // Save the current mode preference
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    }
    function enableDarkMode() {
        body.classList.add('dark-mode');
        updateDarkModeIcon();
        updateColors(true);
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        updateDarkModeIcon();
        updateColors(false);
    }

    function updateDarkModeIcon() {
        if (body.classList.contains('dark-mode')) {
            icon.textContent = '☀️';
            text.textContent = 'Light Mode';
        } else {
            icon.textContent = '🌙';
            text.textContent = 'Dark Mode';
        }
    }


    function updateColors(isDarkMode) {
        updateTableColors(isDarkMode);
        updateMethodInfoColors(isDarkMode);
        updateSearchResultsColors(isDarkMode);
    }

    function updateTableColors(isDarkMode) {
        const table = document.querySelector('.table-container');
        if (table) {
            // We'll let CSS handle the table background color
            const methodHeaders = table.querySelectorAll('th.method-green, th.method-yellow, th.method-red');
            methodHeaders.forEach(header => {
                header.style.color = isDarkMode ? 'var(--dark-heading)' : '';
            });
        }
    }

    function updateMethodInfoColors(isDarkMode) {
        const methodInfo = document.querySelector('.method-info');
        if (methodInfo) {
            const paragraphs = methodInfo.querySelectorAll('p');
            paragraphs.forEach(p => {
                p.style.color = isDarkMode ? 'var(--dark-text)' : '';
            });
        }
    }

    function updateSearchResultsColors(isDarkMode) {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.backgroundColor = isDarkMode ? 'var(--dark-background)' : '';
            const results = searchResults.querySelectorAll('.search-result');
            results.forEach(result => {
                result.style.borderBottomColor = isDarkMode ? 'var(--dark-border)' : '';
                const heading = result.querySelector('h3');
                if (heading) {
                    heading.style.color = isDarkMode ? 'var(--dark-heading)' : '';
                }
                const methodBoxes = result.querySelectorAll('.method-box');
                methodBoxes.forEach(box => {
                    // Let CSS handle the background color
                    box.style.borderColor = isDarkMode ? 'var(--dark-border)' : '';
                    const h4 = box.querySelector('h4');
                    const p = box.querySelector('.method-notes');
                    if (h4) h4.style.color = isDarkMode ? 'var(--dark-text)' : '';
                    if (p) {
                        if (isDarkMode) {
                            if (box.classList.contains('supported')) {
                                p.style.color = 'rgba(46, 204, 113, 0.8)'; // light green
                            } else if (box.classList.contains('partial')) {
                                p.style.color = 'rgba(241, 196, 15, 0.8)'; // light yellow
                            } else {
                                p.style.color = 'var(--dark-text-light)';
                            }
                        } else {
                            p.style.color = ''; // Reset to default in light mode
                        }
                    }
                });
            });
        }
    }


    // Call updateColors on page load to ensure correct colors
    updateColors(body.classList.contains('dark-mode'));
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            searchResults.style.display = 'none';
        } else {
            searchResults.style.display = 'block';
        }
    });
});
