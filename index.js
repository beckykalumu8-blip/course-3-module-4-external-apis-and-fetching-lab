// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const stateInput = document.getElementById("state-input")
const submitBtn = document.getElementById("submit-btn")
const alertList = document.getElementById("alert-list")
const errorMessage = document.getElementById("error-message")
const loadingMessage = document.getElementById("loading-message")

if (!stateInput || !submitBtn || !alertList || !errorMessage || !loadingMessage) {
    console.error("One or more required DOM elements are missing.Ensure that the HTML elements with the correct IDs exist.");
    throw new Error("Missing DOM elements");
}

submitBtn.addEventListener(`click`, () => {
    const stateCode = stateInput.value.trim().toUpperCase();
    if (stateCode.length !== 2) {
        errorMessage.textContent = "Please enter a valid 2-letter state code."
        return;
    }

    hideError();
    clearAlerts();
    showLoading();
    fetchAlerts(stateCode);
});

function fetchAlerts(stateCode) {
    fetch(weatherApi + stateCode)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayAlerts(data);
            stateInput.value = "";
            hideLoading();
            hideError();
        })
        .catch(error => {
            console.error("Fetch error:", error);
            displayError("Failed to fetch alerts. Please try again later.");
            hideLoading();
        });
}


function displayAlerts(data) {
    clearAlerts();

    const summary = `${data.title}: ${data.features.length}`;
    const summaryDiv = document.createElement("div");
    summaryDiv.textContent = summary;
    alertList.appendChild(summaryDiv);

    if (data.features.length === 0) {
        const ul = document.createElement("ul");
        data.features.forEach(alert => {
            const li = document.createElement("li");
            li.textContent = alert.properties.headline;
            ul.appendChild(li);
        });
        alertList.appendChild(ul);
    } else {
        const noAlertDiv = document.createElement("div");
        noAlertDiv.textContent = "No active alerts for this state.";
        alertList.appendChild(noAlertDiv);
    }
}

function clearAlerts() {
    alertList.innerHTML = "";
}

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function hideError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

function showLoading() {
    loadingMessage.style.display = "block";
}

function hideLoading() {
    loadingMessage.style.display = "none";
}