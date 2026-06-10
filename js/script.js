document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Market Rates (Fallback values for March 2026 if API fails)
    let goldPricePerGram = 15038;
    let silverPricePerGram = 255;
    let nisabThreshold = 595 * silverPricePerGram;

    // 2. Fetch Real-Time Data (Simulated/Free API Logic)
    async function fetchLiveRates() {
        try {
            const syncIcon = document.getElementById('sync-icon');
            if (syncIcon) syncIcon.style.animation = "pulse 1s infinite";

            // Note: In a production app, you would use your own API key here 
            // from services like goldapi.io or metals-api.com

            // Simulating network delay for realistic UI interaction
            await new Promise(resolve => setTimeout(resolve, 800));

            // Update UI with the active rates
            document.getElementById('live-gold').innerText = goldPricePerGram.toLocaleString('en-IN');
            document.getElementById('live-silver').innerText = silverPricePerGram.toLocaleString('en-IN');
            
            // Recalculate Nisab
            nisabThreshold = 595 * silverPricePerGram;
            
            if (syncIcon) {
                syncIcon.style.animation = "none";
                syncIcon.innerText = "✅";
            }
            
            // Reset the calculator to a clean state once rates load
            resetCalculator(); 

        } catch (error) {
            console.error("Failed to fetch live rates, using fallbacks.", error);
        }
    }

    // 3. Helper Functions
    function getVal(id) {
        const val = parseFloat(document.getElementById(id).value);
        return isNaN(val) ? 0 : val;
    }

    function formatINR(number) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(number);
    }

    function formatINRExact(number) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(number);
    }

    // 4. Core Calculation Logic
    function calculateZakat() {
        // Fetch Asset Inputs
        const cash = getVal('cash');
        const goldGrams = getVal('gold');
        const silverGrams = getVal('silver');
        const investments = getVal('investments');
        
        // Fetch Liability Inputs
        const debts = getVal('debts');
        const bills = getVal('bills');

        // Convert Precious Metals to INR
        const goldValue = goldGrams * goldPricePerGram;
        const silverValue = silverGrams * silverPricePerGram;

        // Update Metal Values in UI
        document.getElementById('gold-value').innerText = formatINR(goldValue);
        document.getElementById('silver-value').innerText = formatINR(silverValue);

        // Calculate Totals
        const totalAssets = cash + goldValue + silverValue + investments;
        const totalLiabilities = debts + bills;
        const netWealth = totalAssets - totalLiabilities;

        // Update Summary UI
        document.getElementById('total-assets').innerText = formatINR(totalAssets);
        document.getElementById('total-liabilities').innerText = "- " + formatINR(totalLiabilities);
        document.getElementById('net-wealth').innerText = formatINR(netWealth);

        // Final Zakat Logic
        const statusEl = document.getElementById('zakat-status');
        const amountEl = document.getElementById('zakat-amount');

        if (netWealth >= nisabThreshold) {
            const zakatPayable = netWealth * 0.025;
            statusEl.innerText = "Alhamdulillah, you are eligible to pay Zakat.";
            statusEl.style.color = "#10b981"; // Emerald green
            
            amountEl.innerText = formatINRExact(zakatPayable);
            amountEl.style.color = "#10b981";
        } else {
            statusEl.innerText = `Net wealth is below the Nisab threshold (${formatINR(nisabThreshold)}).`;
            statusEl.style.color = "#9ca3af"; // Gray
            
            amountEl.innerText = "₹0.00";
            amountEl.style.color = "#6b7280";
        }
    }

    // 5. Reset Logic Function
    function resetCalculator() {
        // Clear all input fields
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => input.value = '');

        // Reset the dynamic text values to ₹0
        document.getElementById('gold-value').innerText = '₹0';
        document.getElementById('silver-value').innerText = '₹0';
        document.getElementById('total-assets').innerText = '₹0';
        document.getElementById('total-liabilities').innerText = '- ₹0';
        document.getElementById('net-wealth').innerText = '₹0';

        // Reset the final Zakat status and amount
        const statusEl = document.getElementById('zakat-status');
        const amountEl = document.getElementById('zakat-amount');

        statusEl.innerText = "Enter values to check eligibility.";
        statusEl.style.color = "#9ca3af"; // Gray
        
        amountEl.innerText = "₹0.00";
        amountEl.style.color = "#6b7280"; // Gray
    }

    // 6. Attach Event Listeners to Buttons
    const calcBtn = document.getElementById('calc-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (calcBtn) calcBtn.addEventListener('click', calculateZakat);
    if (resetBtn) resetBtn.addEventListener('click', resetCalculator);

    // 7. Initialize
    fetchLiveRates();
});