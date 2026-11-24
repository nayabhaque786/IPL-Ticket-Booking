const ticketPrices = {
    General: 500,
    Premium: 1000,
    VIP: 2000,
    Corporate: 3500
};

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

let toastTimeout;
let toastRemovalTimeout;
let summaryToastTimeout;

function showToast(message, type = "success") {
    const toastType = type === "error"
        ? "error"
        : type === "info" || type === "information"
            ? "info"
            : "success";

    window.clearTimeout(summaryToastTimeout);
    window.clearTimeout(toastTimeout);
    window.clearTimeout(toastRemovalTimeout);

    const existingToast = document.querySelector(".toast");
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toast ${toastType}`;
    toast.setAttribute("role", toastType === "error" ? "alert" : "status");
    toast.textContent = message;
    document.body.appendChild(toast);

    toastTimeout = window.setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    toastRemovalTimeout = window.setTimeout(() => {
        toast.classList.remove("show");
        window.setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function updateBookingSummary(showNotification = false) {
    const summary = document.querySelector("#booking-summary");
    const nameInput = document.getElementById("name");
    const matchSelect = document.getElementById("match");
    const standSelect = document.getElementById("stand");
    const quantityInput = document.getElementById("tickets");

    if (!summary || !nameInput || !matchSelect || !standSelect || !quantityInput) {
        return;
    }

    const summaryPlaceholder = summary.querySelector("#summary-placeholder");
    const summaryContent = summary.querySelector("#summary-content");
    const quantity = quantityInput.valueAsNumber;
    const pricePerTicket = ticketPrices[standSelect.value];

    if (!matchSelect.value || !pricePerTicket || !quantityInput.checkValidity()) {
        summaryPlaceholder.hidden = false;
        summaryContent.hidden = true;
        window.clearTimeout(summaryToastTimeout);
        return;
    }

    summary.querySelector("#summary-name").textContent = nameInput.value.trim() || "Not entered";
    summary.querySelector("#summary-match").textContent =
        matchSelect.selectedOptions[0].textContent;
    summary.querySelector("#summary-stand").textContent =
        standSelect.selectedOptions[0].textContent;
    summary.querySelector("#summary-quantity").textContent = String(quantity);
    summary.querySelector("#summary-unit-price").textContent =
        rupeeFormatter.format(pricePerTicket);
    summary.querySelector("#summary-total").textContent =
        rupeeFormatter.format(pricePerTicket * quantity);

    summaryPlaceholder.hidden = true;
    summaryContent.hidden = false;

    if (showNotification) {
        window.clearTimeout(summaryToastTimeout);
        summaryToastTimeout = window.setTimeout(() => {
            showToast("Booking summary updated successfully!", "success");
        }, 600);
    }
}

function initializeBookingSummary() {
    const matchSelect = document.getElementById("match");
    const standSelect = document.getElementById("stand");
    const quantityInput = document.getElementById("tickets");
    const nameInput = document.getElementById("name");
    const bookingForm = document.querySelector(".booking-container form");

    if (!matchSelect || !standSelect || !quantityInput || !nameInput || !bookingForm) {
        return;
    }

    matchSelect.addEventListener("change", () => updateBookingSummary(true));
    standSelect.addEventListener("change", () => updateBookingSummary(true));
    quantityInput.addEventListener("input", () => updateBookingSummary(true));
    quantityInput.addEventListener("change", () => updateBookingSummary(true));
    nameInput.addEventListener("input", () => updateBookingSummary());
    bookingForm.addEventListener("reset", () => {
        window.setTimeout(() => updateBookingSummary(), 0);
    });
    updateBookingSummary();
}

function initializeBookButtons() {
    document.querySelectorAll(".schedule-book-button, .book-btn, .book-button")
        .forEach((button) => {
            button.addEventListener("click", (event) => {
                const bookingForm = document.querySelector(
                    "#booking, #booking-form, .booking-container"
                );

                if (!bookingForm) {
                    return;
                }

                event.preventDefault();
                bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
                showToast("Redirecting you to the booking section!", "success");
            });
        });
}

function initializeTeamFilter() {
    const teamFilter = document.getElementById("Team");
    const matchCards = document.querySelectorAll(".match-card");
    const noMatchesMessage = document.getElementById("no-matches-message");

    if (!teamFilter || matchCards.length === 0 || !noMatchesMessage) {
        return;
    }

    const filterMatches = () => {
        let visibleCount = 0;

        matchCards.forEach((card) => {
            const teams = card.dataset.teams.split(/\s+/);
            const matchesTeam = teamFilter.value === "all" || teams.includes(teamFilter.value);
            card.hidden = !matchesTeam;
            if (matchesTeam) {
                visibleCount += 1;
            }
        });

        noMatchesMessage.hidden = visibleCount > 0;
    };

    teamFilter.addEventListener("change", filterMatches);
    filterMatches();
}

function initializeMatchViewToggle() {
    const matchCards = document.getElementById("match-cards");
    const gridButton = document.getElementById("grid-view-button");
    const listButton = document.getElementById("list-view-button");

    if (!matchCards || !gridButton || !listButton) {
        return;
    }

    const setView = (view) => {
        const isGridView = view === "grid";
        matchCards.classList.toggle("is-list-view", !isGridView);
        gridButton.classList.toggle("is-active", isGridView);
        listButton.classList.toggle("is-active", !isGridView);
        gridButton.setAttribute("aria-pressed", String(isGridView));
        listButton.setAttribute("aria-pressed", String(!isGridView));
    };

    gridButton.addEventListener("click", () => setView("grid"));
    listButton.addEventListener("click", () => setView("list"));
    setView("grid");
}

function initializeMobileNavigation() {
    const menuButton = document.querySelector(".nav-toggle");
    const navigation = document.getElementById("primary-navigation");

    if (!menuButton || !navigation) {
        return;
    }

    const setMenuOpen = (isOpen) => {
        menuButton.classList.toggle("is-open", isOpen);
        navigation.classList.toggle("is-open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    };

    menuButton.addEventListener("click", () => {
        setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuOpen(false);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeBookingSummary();
    initializeBookButtons();
    initializeTeamFilter();
    initializeMatchViewToggle();
    initializeMobileNavigation();
});
