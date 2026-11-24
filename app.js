
// ACTIVITY 5 - JavaScript Basics

// Reusable Toast Notification Function
function showToast(message, type = "success") {

    // Remove previous toast if it exists
    const oldToast = document.querySelector(".toast");
    if (oldToast) {
        oldToast.remove();
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    toast.textContent = message;

    // Add toast to webpage
    document.body.appendChild(toast);

    // Show animation
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 400);

    }, 3000);
}


// Book Button Functionality
document.addEventListener("DOMContentLoaded", function () {

    const bookButtons = document.querySelectorAll(
        ".book-btn, .book-button"
    );

    bookButtons.forEach(button => {

        button.addEventListener("click", function (event) {

            const bookingForm = document.querySelector(
                "#booking, #booking-form, .booking-container"
            );

            if (bookingForm) {
                event.preventDefault();

                bookingForm.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                showToast(
                    "Redirecting you to the booking section!",
                    "success"
                );
            } else {
                showToast(
                    "Opening ticket booking!",
                    "info"
                );
            }

        });

    });

    console.log("Activity 5 JavaScript loaded successfully!");
});

showToast("Activity 5 is working!", "success");