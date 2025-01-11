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

  if (searchTerm.length < 2) {
    resultsContainer.style.display = 'none';
    resetTableHighlight();
    return;
  }

  resultsContainer.style.display = 'block';

  const searchVersion = parseFloat(searchTerm);
  if (!isNaN(searchVersion)) { 
    const nearestVersion = findNearestVersion(searchVersion);
    if (nearestVersion) {
      highlightTableRow(nearestVersion.version);
      displayVersionInfo(nearestVersion);
    } else {
      showNoResults();
      resetTableHighlight();
    }
  } else {
    const matchingVersions = webOSVersions.filter(version => 
      version.version.toLowerCase().includes(searchTerm) ||
      version.rootMethods.some(method => method.toLowerCase().includes(searchTerm)) ||
      version.notes.toLowerCase().includes(searchTerm)
    );

    if (matchingVersions.length === 0) {
      showNoResults();
      resetTableHighlight();
    } else {
      matchingVersions.forEach(version => {
        displayVersionInfo(version);
      });
      highlightTableRow(matchingVersions[0].version);
    }
  }
}

function findNearestVersion(searchVersion) {
  return webOSVersions.reduce((nearest, current) => {
    const currentVersion = parseFloat(current.version);
    if (currentVersion <= searchVersion && (!nearest || currentVersion > parseFloat(nearest.version))) {
      return current;
    }
    return nearest;
  }, null);
}

function displayVersionInfo(version) {
  const resultElement = document.createElement('div');
  resultElement.classList.add('search-result');

  let methodsHtml = version.rootMethods.map(method => `
    <div class="method-box ${method.status}">
      <h4>${method.name}</h4>
      <p>${method.notes}</p>
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
}




function highlightTableRow(version) {
  const rootingTable = document.getElementById('rootingTable');
  const rows = rootingTable.querySelectorAll('tbody tr');
  rows.forEach(row => {
    if (row.cells[0].textContent.trim() === version.toString() + '.x') {
      row.classList.add('highlighted');
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      row.classList.remove('highlighted');
    }
  });
}

function resetTableHighlight() {
  const rows = document.querySelectorAll('#rootingTable tbody tr');
  rows.forEach(row => row.classList.remove('highlighted'));
}

function showNoResults() {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '<div class="no-results">No results found.</div>';
}

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9.]/g, '');

    let periodCount = (this.value.match(/\./g) || []).length;
    if (periodCount > 1) {
      this.value = this.value.replace(/\.+$/, '');
    }

    if (this.value.length > 3) {
      this.value = this.value.slice(0, 3);
    }

    search(); // on input
  });
});
