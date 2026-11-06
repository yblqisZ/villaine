
/* ==========================================
   VILLAINÉ - GROUP DISCOUNT CALCULATOR
   ICT600 INDIVIDUAL ASSIGNMENT

   Features:
   1. Customer input validation
   2. Quantity selection (+ / -)
   3. Group discount calculation
   4. Booking result summary
   5. Reset functionality
   6. Preselected lair from homepage
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. GET HTML ELEMENTS
    // ======================================

    const bookingForm = document.getElementById("bookingForm");

    const nameInput = document.getElementById("customerName");
    const emailInput = document.getElementById("customerEmail");
    const phoneInput = document.getElementById("customerNumPhone");

    const quantityInputs = document.querySelectorAll(".lair-qty");
    const lairOptions = document.querySelectorAll(".lair-option");

    const formMessage = document.getElementById("formMessage");
    const resultSection = document.getElementById("resultSection");

    const MAX_LAIRS = 50;

    // ======================================
    // 2. FORMAT CURRENCY
    // ======================================

    function formatRM(amount) {
        return "RM " + amount.toFixed(2);
    }

    // ======================================
    // 3. GROUP DISCOUNT RULES
    // ======================================

    function getDiscountRate(totalQuantity) {

        if (totalQuantity >= 10) {
            return 0.15;
        } else if (totalQuantity >= 5) {
            return 0.10;
        } else if (totalQuantity >= 3) {
            return 0.05;
        } else {
            return 0;
        }

    }

    // ======================================
    // 4. DISPLAY VALIDATION ERRORS
    // ======================================

    function showError(message, inputElement = null) {

        formMessage.style.color = "#FF8F9B";
        formMessage.textContent = message;

        // Assignment requirement:
        // Display alert for invalid input.
        alert(message);

        if (inputElement) {
            inputElement.focus();
        }

    }

    function clearMessage() {
        formMessage.textContent = "";
    }

    // ======================================
    // 5. RESET RESULT SUMMARY
    // ======================================

    function clearResults() {

        document.getElementById("resultName").textContent = "—";
        document.getElementById("resultEmail").textContent = "—";
        document.getElementById("resultPhone").textContent = "—";

        document.getElementById("resultQuantity").textContent = "0";

        document.getElementById("resultSubtotal").textContent = "RM 0.00";
        document.getElementById("resultDiscount").textContent = "RM 0.00";
        document.getElementById("resultRate").textContent = "0%";
        document.getElementById("resultFinal").textContent = "RM 0.00";

        document.getElementById("selectedLairsResult").innerHTML =
            "<p>No lairs selected yet.</p>";

    }

    // ======================================
    // 6. GET TOTAL QUANTITY
    // ======================================

    function getTotalQuantity() {

        let total = 0;

        quantityInputs.forEach(function (input) {

            const quantity = Number(input.value);

            if (Number.isInteger(quantity) && quantity >= 0) {
                total += quantity;
            }

        });

        return total;
    }

    // ======================================
    // 7. QUANTITY PLUS / MINUS BUTTONS
    // ======================================

    lairOptions.forEach(function (option) {

        const minusButton = option.querySelector(".qty-minus");
        const plusButton = option.querySelector(".qty-plus");
        const quantityInput = option.querySelector(".lair-qty");

        // INCREASE QUANTITY
        plusButton.addEventListener("click", function () {

            const currentQuantity = Number(quantityInput.value);

            if (!Number.isInteger(currentQuantity) ||
                currentQuantity < 0 ||
                currentQuantity > MAX_LAIRS) {

                showError(
                    "Please enter a valid quantity between 0 and 50.",
                    quantityInput
                );
                return;
            }

            if (getTotalQuantity() >= MAX_LAIRS) {

                showError(
                    "You can only select a maximum of 50 lairs."
                );
                return;
            }

            quantityInput.value = currentQuantity + 1;

            clearMessage();
            clearResults();

        });

        // DECREASE QUANTITY
        minusButton.addEventListener("click", function () {

            const currentQuantity = Number(quantityInput.value);

            if (!Number.isInteger(currentQuantity) ||
                currentQuantity < 0 ||
                currentQuantity > MAX_LAIRS) {

                showError(
                    "Please enter a valid quantity between 0 and 50.",
                    quantityInput
                );
                return;
            }

            if (currentQuantity > 0) {
                quantityInput.value = currentQuantity - 1;
            }

            clearMessage();
            clearResults();

        });

        // CLEAR OLD RESULTS WHEN QUANTITY CHANGES
        quantityInput.addEventListener("input", function () {
            clearMessage();
            clearResults();
        });

    });

    // CLEAR OLD RESULTS WHEN CUSTOMER DETAILS CHANGE
    [nameInput, emailInput, phoneInput].forEach(function (input) {

        input.addEventListener("input", function () {
            clearMessage();
            clearResults();
        });

    });

    // ======================================
    // 8. VALIDATE CUSTOMER DETAILS
    // ======================================

    function validateCustomer() {

        const customerName = nameInput.value.trim();
        const customerEmail = emailInput.value.trim();
        const customerPhone = phoneInput.value.trim();

        // FULL NAME VALIDATION
        if (customerName === "") {

            showError(
                "Please enter your full name.",
                nameInput
            );

            return false;
        }

        if (customerName.length < 2) {

            showError(
                "Full name must contain at least 2 characters.",
                nameInput
            );

            return false;
        }

        // EMAIL VALIDATION
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (customerEmail === "" ||
            !emailPattern.test(customerEmail)) {

            showError(
                "Please enter a valid email address.",
                emailInput
            );

            return false;
        }

        // MALAYSIAN PHONE NUMBER VALIDATION
        // Examples: 0123456789, 01112345678
        const phonePattern = /^01[0-9]{8,9}$/;

        if (!phonePattern.test(customerPhone)) {

            showError(
                "Please enter a valid Malaysian phone number (10–11 digits, starting with 01).",
                phoneInput
            );

            return false;
        }

        return true;
    }

    // ======================================
    // 9. VALIDATE LAIR QUANTITIES
    // ======================================

    function validateLairs() {

        let totalQuantity = 0;

        for (const input of quantityInputs) {

            // REJECT EMPTY VALUES
            if (input.value.trim() === "") {

                showError(
                    "Lair quantity cannot be empty. Enter 0 if not selected.",
                    input
                );

                return false;
            }

            const quantity = Number(input.value);

            // REJECT DECIMAL, NEGATIVE OR OVER 50
            if (!Number.isInteger(quantity) ||
                quantity < 0 ||
                quantity > MAX_LAIRS) {

                showError(
                    "Please enter a whole number between 0 and 50.",
                    input
                );

                return false;
            }

            totalQuantity += quantity;
        }

        // REQUIRE AT LEAST ONE LAIR
        if (totalQuantity === 0) {

            showError(
                "Please select at least one lair before calculating."
            );

            return false;
        }

        // MAXIMUM 50 LAIRS IN TOTAL
        if (totalQuantity > MAX_LAIRS) {

            showError(
                "The total quantity cannot exceed 50 lairs."
            );

            return false;
        }

        return true;
    }

    // ======================================
    // 10. CALCULATE BOOKING TOTAL
    // ======================================

    function calculateBooking() {

        let totalQuantity = 0;
        let subtotal = 0;

        const selectedLairs = [];

        quantityInputs.forEach(function (input) {

            const quantity = Number(input.value);
            const price = Number(input.dataset.price);
            const lairName = input.dataset.name;

            if (quantity > 0) {

                const itemTotal = price * quantity;

                totalQuantity += quantity;
                subtotal += itemTotal;

                selectedLairs.push({
                    name: lairName,
                    quantity: quantity,
                    price: price,
                    total: itemTotal
                });

            }

        });

        // APPLY GROUP DISCOUNT
        const discountRate = getDiscountRate(totalQuantity);

        const discountAmount = subtotal * discountRate;

        const finalAmount = subtotal - discountAmount;

        return {
            selectedLairs: selectedLairs,
            totalQuantity: totalQuantity,
            subtotal: subtotal,
            discountRate: discountRate,
            discountAmount: discountAmount,
            finalAmount: finalAmount
        };
    }

    // ======================================
    // 11. DISPLAY RESULT SUMMARY
    // ======================================

    function displayResults(result) {

        // CUSTOMER DETAILS
        document.getElementById("resultName").textContent =
            nameInput.value.trim();

        document.getElementById("resultEmail").textContent =
            emailInput.value.trim();

        document.getElementById("resultPhone").textContent =
            phoneInput.value.trim();

        // TOTAL QUANTITY
        document.getElementById("resultQuantity").textContent =
            result.totalQuantity;

        // CALCULATION DETAILS
        document.getElementById("resultSubtotal").textContent =
            formatRM(result.subtotal);

        document.getElementById("resultDiscount").textContent =
            formatRM(result.discountAmount);

        document.getElementById("resultRate").textContent =
            (result.discountRate * 100).toFixed(0) + "%";

        document.getElementById("resultFinal").textContent =
            formatRM(result.finalAmount);

        // DISPLAY SELECTED LAIRS
        const selectedLairsContainer =
            document.getElementById("selectedLairsResult");

        selectedLairsContainer.innerHTML = "";

        result.selectedLairs.forEach(function (lair) {

            const item = document.createElement("p");

            const nameSpan = document.createElement("span");
            nameSpan.textContent =
                lair.name + " × " + lair.quantity;

            const priceSpan = document.createElement("span");
            priceSpan.textContent =
                formatRM(lair.total);

            item.appendChild(nameSpan);
            item.appendChild(priceSpan);

            selectedLairsContainer.appendChild(item);

        });

        // SCROLL TO RESULT SUMMARY
        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

    // ======================================
    // 12. FORM SUBMISSION
    // ======================================

    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        clearMessage();
        clearResults();

        // VALIDATE CUSTOMER INFORMATION
        if (!validateCustomer()) {
            return;
        }

        // VALIDATE LAIR SELECTION
        if (!validateLairs()) {
            return;
        }

        // CALCULATE ONLY AFTER VALIDATION PASSES
        const result = calculateBooking();

        // DISPLAY FINAL RESULTS
        displayResults(result);

        formMessage.style.color = "#A9E8BD";
        formMessage.textContent =
            "Calculation completed successfully!";

        alert("Calculation completed successfully!");

    });

    // ======================================
    // 13. RESET FORM
    // ======================================

    bookingForm.addEventListener("reset", function () {

        // Wait until the browser finishes its default reset.
        setTimeout(function () {

            quantityInputs.forEach(function (input) {
                input.value = 0;
            });

            clearMessage();
            clearResults();

            formMessage.style.color = "#FF8F9B";

        }, 0);

    });

    // ======================================
    // 14. PRESELECT LAIR FROM HOMEPAGE
    // ======================================

    const urlParams = new URLSearchParams(window.location.search);

    const selectedLair = urlParams.get("lair");

    if (selectedLair) {

        const matchingLair = Array.from(lairOptions).find(
            function (option) {
                return option.dataset.lair === selectedLair;
            }
        );

        if (matchingLair) {

            const input = matchingLair.querySelector(".lair-qty");

            input.value = 1;

            matchingLair.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }

});
