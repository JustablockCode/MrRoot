let webOSVersions = [];

fetch('./webosversions.json')
  .then(response => response.json())
  .then(data => {
    webOSVersions = data.versions;
  })
  .catch(error => console.error('Error loading webOS versions:', error));

function search() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const resultsContainer = document.getElementById('searchResults');
  const rootingTable = document.getElementById('rootingTable');
  resultsContainer.innerHTML = '';

  if (searchTerm.trim() === '') {
    clearSearchResults();
    return;
  }

  const searchVersion = parseFloat(searchTerm);
  const matchingVersions = !isNaN(searchVersion)
    ? [findNearestVersion(searchVersion)].filter(Boolean)
    : webOSVersions.filter(version => 
        version.version.toLowerCase().includes(searchTerm) ||
        version.rootMethods.some(method => method.toLowerCase().includes(searchTerm)) ||
        version.notes.toLowerCase().includes(searchTerm)
      );

  if (matchingVersions.length === 0) {
    showNoResults();
    resetTableHighlight();
  } else {
    matchingVersions.forEach(displayVersionInfo);
    highlightTableRow(matchingVersions[0].version);
  }
}

function findNearestVersion(searchVersion) {
  return webOSVersions.reduce((nearest, current) => {
    const currentVersion = parseFloat(current.version);
    return currentVersion <= searchVersion && (!nearest || currentVersion > parseFloat(nearest.version))
      ? current
      : nearest;
  }, null);
}

function displayVersionInfo(version) {
  const resultElement = document.createElement('div');
  resultElement.classList.add('search-result');

  let methodsHtml = version.rootMethods.map(method => `
    <div class="method-box ${method.status}">
      <h4>${method.name}</h4>
      <p class="method-notes">${method.notes}</p>
      <span class="status-indicator">${method.status}</span>
    </div>
  `).join('');
  resultElement.innerHTML = `
    <h3>webOS ${version.version}</h3>
    <div class="methods-container">
      ${methodsHtml}
    </div>
  `;
  document.getElementById('searchResults').appendChild(resultElement);

  // Apply correct colors based on current mode
  updateSearchResultsColors(document.body.classList.contains('dark-mode'));
}


function highlightTableRow(version) {
  const rows = document.querySelectorAll('#rootingTable tbody tr');
  rows.forEach(row => {
    const isHighlighted = row.cells[0].textContent.trim() === `${version}.x`;
    row.classList.toggle('highlighted', isHighlighted);
    if (isHighlighted) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function resetTableHighlight() {
  document.querySelectorAll('#rootingTable tbody tr').forEach(row => row.classList.remove('highlighted'));
}

function clearSearchResults() {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';
  resultsContainer.style.border = 'none';
}
function showNoResults() {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '<div class="no-results">No results found.</div>';
  resultsContainer.style.border = '1px solid var(--border-color)';
}

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');

  clearSearchResults();

  searchInput.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9.]/g, '');

    let periodCount = (this.value.match(/\./g) || []).length;
    if (periodCount > 1) {
      this.value = this.value.replace(/\.+$/, '');
    }

    if (this.value.length > 5) {
      this.value = this.value.slice(0, 5);
    }

    if (this.value.trim() === '') {
      clearSearchResults();
    } else {
      search();
    }
  });
});


