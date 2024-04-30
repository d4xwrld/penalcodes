const penalCodesTable = document.getElementById('penal-codes-table');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results-div');
const cartDiv = document.getElementById('cart');
let cart = [];

// load JSON data
fetch('penal.json')
  .then(response => response.json())
  .then(data => {
    // generate table rows
    generateTableRows(data);
    // add event listener to search input
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredData = filterData(data, searchTerm);
      generateTableRows(filteredData);
      updateResultsDiv(filteredData);
    });
  });

function generateTableRows(data) {
  // clear table rows
  penalCodesTable.innerHTML = '';
  // generate new table rows
  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item["Penal ID"]}</td>
      <td>${item["Crime Descriptions"]}</td>
      <td>${item["Time"]}</td>
      <td>${item["Fines"]}</td>
      <td><button class="btn btn-success" onclick="addToCart(this)">Add</button></td>
    `;
    penalCodesTable.appendChild(row);
  });
}
function updateTableRows(filteredData) {
  tableBody.innerHTML = generateTableRows(filteredData).join('');
}

searchInput.addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const filteredData = filterData(data, searchTerm);
  updateResultsDiv(filteredData);
  updateTableRows(filteredData);
});

function filterData(data, searchTerm) {
    return data.map(item => {
      const isAdded = cart.includes(item);
      const filteredItem = { ...item, isAdded };
      return { ...filteredItem, isIncluded: filteredItem["Penal ID"].toString().includes(searchTerm) || filteredItem["Crime Descriptions"].toLowerCase().includes(searchTerm) };
    }).filter(item => item.isIncluded);
  }

function addToCart(button) {
  const row = button.parentElement.parentElement;
  const item = {
    "Penal ID": row.cells[0].textContent,
    "Crime Descriptions": row.cells[1].textContent,
    "Time": row.cells[2].textContent,
    "Fines": row.cells[3].textContent
  };
  if (!cart.includes(item)) {
    cart.push(item);
  }
  updateCartDiv();
  updateResultsDiv();
}


function updateCartDiv() {
    cartDiv.innerHTML = cart.map(item => `<p class="text-warning">${item["Penal ID"]} - ${item["Crime Descriptions"]} - ${item["Time"]} days - $${item["Fines"]}</p>`).join('');
}
function updateResultsDiv(filteredData) {
    const addedItems = filteredData.filter(item => item.isAdded === false);
    const addedFines = addedItems.reduce((sum, item) => sum + parseInt(item["Fines"]), 0);
    const totalFines = cart.reduce((sum, item) => sum + parseInt(item["Fines"]), 0);
    const addedJailTime = addedItems.reduce((sum, item) => sum + parseInt(item["Time"]), 0);
    const totalJailTime = cart.reduce((sum, item) => sum + parseInt(item["Time"]), 0);
    resultsDiv.innerHTML = `
      <p class="text-danger">Total Fines: $${totalFines}</p>
      <p class="text-danger">Total Jail Time: ${totalJailTime} days</p>
    `;
  }
