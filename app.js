const TOAST_DURATION = 2700;
const TOAST_TRANSITION_DURATION = 250;
let toastTimeout;
let toastRemovalTimeout;

function showToast(message, type) {
    const supportedTypes = ["success", "error", "information"];
    const toastType = supportedTypes.includes(type) ? type : "information";
    let container = document.querySelector(".toast-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        container.setAttribute("aria-live", "polite");
        container.setAttribute("aria-atomic", "true");
        document.body.appendChild(container);
    }

    window.clearTimeout(toastTimeout);
    window.clearTimeout(toastRemovalTimeout);
    container.replaceChildren();

    const toast = document.createElement("div");
    toast.className = `toast toast--${toastType}`;
    toast.setAttribute("role", toastType === "error" ? "alert" : "status");
    toast.textContent = message;
    container.appendChild(toast);

    window.requestAnimationFrame(() => {
        toast.classList.add("is-visible");
    });

    toastTimeout = window.setTimeout(() => {
        toast.classList.remove("is-visible");
        toast.classList.add("is-hiding");
        toastRemovalTimeout = window.setTimeout(() => {
            toast.remove();
        }, TOAST_TRANSITION_DURATION);
    }, TOAST_DURATION);
}

document.querySelectorAll(".schedule-book-button").forEach((button) => {
    button.addEventListener("click", (event) => {
        const bookingForm = document.querySelector("#booking");

        if (!bookingForm) {
            return;
        }

        event.preventDefault();
        bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
        showToast("Redirecting you to the booking section!", "success");
    });
});
