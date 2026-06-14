const display = document.getElementById('display');
let calculationHistory = [];

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    const config = {
        epsilon: 1e-12,
        matrix: 'Matrix',
        number: 'number',
        precision: 64,
        predictable: false,
        randomSeed: null
    };
    const math_instance = math.create(math.all, config);

    try {
        let expression = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        const originalExpression = display.value; 

        const result = math_instance.evaluate(expression);
        const formattedResult = math.format(result, { precision: 14 });
        display.value = formattedResult;

        const historyEntry = `${originalExpression} = ${formattedResult}`;
        addToHistory(historyEntry);
    } catch (error) {
        display.value = 'Error';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-tab');
    const calculators = document.querySelectorAll('.calculator');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCalculatorId = tab.dataset.calculator + '-calculator';
            const targetCalculator = document.getElementById(targetCalculatorId);

            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            calculators.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            if (targetCalculator) {
                targetCalculator.classList.add('active');
            }

        });
    });
    
    setupAllConverters();

    const clearHistoryBtn = document.getElementById('clear-history-btn');
    clearHistoryBtn.addEventListener('click', clearHistory);

    const savedHistory = localStorage.getItem('calcHistory');
    if (savedHistory) {
        calculationHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
            themeToggle.checked = true;
        }
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});

let memoryValue = 0;

function updateMemoryIndicator() {
    const indicator = document.getElementById('memory-indicator');
    if (indicator) {
        indicator.style.visibility = memoryValue === 0 ? 'hidden' : 'visible';
    }
}

function memoryClear() {
    memoryValue = 0;
    updateMemoryIndicator();
}

function memoryRecall() {
    display.value = memoryValue;
}

function memoryAdd() {
    const currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        memoryValue += currentValue;
        updateMemoryIndicator();
    }
}

function memorySubtract() {
    const currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        memoryValue -= currentValue;
        updateMemoryIndicator();
    }
}

function addToHistory(entry) {
    calculationHistory.unshift(entry); 
    if (calculationHistory.length > 20) { 
        calculationHistory.pop();
    }
    updateHistoryDisplay();
    saveHistory();
}

function updateHistoryDisplay() {
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = ''; 

    calculationHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = entry;
        item.addEventListener('click', () => {
            const result = entry.split(' = ')[1];
            if (result) {
                display.value = result;
            }
        });
        historyContent.appendChild(item);
    });
}

function clearHistory() {
    calculationHistory = [];
    localStorage.removeItem('calcHistory');
    updateHistoryDisplay();
}

function saveHistory() {
    localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
}


let angleMode = 'RAD'; 

function toggleAngleMode() {
    const angleModeDisplay = document.getElementById('angle-mode');
    if (angleMode === 'RAD') {
        angleMode = 'DEG';
        angleModeDisplay.textContent = 'DEG';
    } else {
        angleMode = 'RAD';
        angleModeDisplay.textContent = 'RAD';
    }
}

function getNumberFromDisplay(unit = 'rad') {
    let number = parseFloat(display.value);
    if (isNaN(number)) return NaN;

    if (unit === 'trig' && angleMode === 'DEG') {
        return number * (Math.PI / 180);
    }
    return number;
}

function calculateSin() {
    display.value = Math.sin(getNumberFromDisplay('trig'));
}

function calculateCos() {
    display.value = Math.cos(getNumberFromDisplay('trig'));
}

function calculateTan() {
    display.value = Math.tan(getNumberFromDisplay('trig'));
}

function calculateInvSin() {
    let result = Math.asin(getNumberFromDisplay());
    if (angleMode === 'DEG') result *= (180 / Math.PI);
    display.value = result;
}

function calculateInvCos() {
    let result = Math.acos(getNumberFromDisplay());
    if (angleMode === 'DEG') result *= (180 / Math.PI);
    display.value = result;
}

function calculateInvTan() {
    let result = Math.atan(getNumberFromDisplay());
    if (angleMode === 'DEG') result *= (180 / Math.PI);
    display.value = result;
}

function calculateSinh() {
    display.value = Math.sinh(getNumberFromDisplay());
}

function calculateCosh() {
    display.value = Math.cosh(getNumberFromDisplay());
}

function calculateTanh() {
    display.value = Math.tanh(getNumberFromDisplay());
}

function calculateLog() {
    display.value = Math.log10(getNumberFromDisplay());
}

function calculateLn() {
    display.value = Math.log(getNumberFromDisplay());
}

function calculateSqrt() {
    display.value = Math.sqrt(getNumberFromDisplay());
}

function calculateSquare() {
    display.value = Math.pow(getNumberFromDisplay(), 2);
}

function calculateCube() {
    display.value = Math.pow(getNumberFromDisplay(), 3);
}

function calculatePower() {
    display.value += '^';
}

function calculateTenPower() {
    display.value = Math.pow(10, getNumberFromDisplay());
}

function calculateExp() {
    display.value = Math.exp(getNumberFromDisplay());
}

function calculateAbs() {
    display.value = Math.abs(getNumberFromDisplay());
}

function calculateFactorial() {
    let num = getNumberFromDisplay();
    if (Number.isInteger(num) && num >= 0) {
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        display.value = result;
    } else {
        display.value = "Error";
    }
}

function calculatePi() {
    display.value = Math.PI;
}

function calculateEuler() {
    display.value = Math.E;
}

function setupAllConverters() {
    setupCurrencyConverter();
    setupLengthConverter();
    setupDataConverter();
    setupTemperatureConverter();
    setupDiscountCalculator();
    setupPercentageCalculator();
    setupTipCalculator();
    setupLoanCalculator();
    setupDateCalculator();
    setupBMICalculator();
}

function setupCurrencyConverter() {
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertAmountInput = document.getElementById('convert-amount');
    const swapButton = document.getElementById('swap-button');
    let currenciesLoaded = false;

    async function populateCurrencyDropdowns() {
        if (currenciesLoaded) return;

        const converterResultDiv = document.getElementById('converter-result');
        const API_BASE_URL = 'https://api.exchangerate.host';
    try {
        const response = await fetch(`${API_BASE_URL}/symbols`);
        const data = await response.json();

        if (!data.success) {
            converterResultDiv.textContent = 'Could not load currencies.';
            return;
        }

        const symbols = data.symbols;
        for (const symbol in symbols) {
            const option1 = document.createElement('option');
            option1.value = symbol;
            option1.textContent = `${symbol} - ${symbols[symbol].description}`;
            fromCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = symbol;
            option2.textContent = `${symbol} - ${symbols[symbol].description}`;
            toCurrencySelect.appendChild(option2);
        }

        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';
        currenciesLoaded = true;
        await convertCurrency();

    } catch (error) {
        converterResultDiv.textContent = 'Error fetching currency list.';
        console.error('Error populating currencies:', error);
    }
}
    
    async function convertCurrency() {
        const amount = convertAmountInput.value;
        const from = fromCurrencySelect.value;
        const to = toCurrencySelect.value;
        const converterResultDiv = document.getElementById('converter-result');
        const API_BASE_URL = 'https://api.exchangerate.host';

        if (amount <= 0 || !from || !to) {
            converterResultDiv.innerHTML = 'Please enter a valid amount.';
            return;
        }

        converterResultDiv.innerHTML = 'Converting...';

        try {
            const response = await fetch(`${API_BASE_URL}/convert?from=${from}&to=${to}&amount=${amount}`);
            const data = await response.json();

            if (!data.success) {
                converterResultDiv.innerHTML = 'Conversion failed. Please try again.';
                return;
            }

            const result = data.result.toFixed(2);
            const rate = data.info.rate.toFixed(4);

            converterResultDiv.innerHTML = `<strong>${result} ${to}</strong><span class="rate">1 ${from} = ${rate} ${to}</span>`;

        } catch (error) {
            converterResultDiv.innerHTML = 'Unable to fetch exchange rates.';
            console.error('Error converting currency:', error);
        }
    }

    convertAmountInput.addEventListener('input', convertCurrency);
    fromCurrencySelect.addEventListener('change', convertCurrency);
    toCurrencySelect.addEventListener('change', convertCurrency);
    swapButton.addEventListener('click', () => {
        [fromCurrencySelect.value, toCurrencySelect.value] = [toCurrencySelect.value, fromCurrencySelect.value];
        convertCurrency();
    });

    populateCurrencyDropdowns();
}

const lengthUnits = [
    { name: 'Millimeter', symbol: 'mm', toMeterFactor: 0.001 },
    { name: 'Centimeter', symbol: 'cm', toMeterFactor: 0.01 },
    { name: 'Meter', symbol: 'm', toMeterFactor: 1 },
    { name: 'Kilometer', symbol: 'km', toMeterFactor: 1000 },
    { name: 'Inch', symbol: 'in', toMeterFactor: 0.0254 },
    { name: 'Foot', symbol: 'ft', toMeterFactor: 0.3048 },
    { name: 'Yard', symbol: 'yd', toMeterFactor: 0.9144 },
    { name: 'Mile', symbol: 'mi', toMeterFactor: 1609.34 },
];

function setupLengthConverter() {
    const fromLengthUnitSelect = document.getElementById('from-length-unit');
    const toLengthUnitSelect = document.getElementById('to-length-unit');
    const lengthAmountInput = document.getElementById('length-amount');
    const lengthConverterResultDiv = document.getElementById('length-converter-result');
    const swapLengthButton = document.getElementById('swap-length-button');

    function populateLengthDropdowns() {
        lengthUnits.forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit.symbol;
            option1.textContent = `${unit.name} (${unit.symbol})`;
            fromLengthUnitSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = unit.symbol;
            option2.textContent = `${unit.name} (${unit.symbol})`;
            toLengthUnitSelect.appendChild(option2);
        });

        fromLengthUnitSelect.value = 'cm';
        toLengthUnitSelect.value = 'in';

        convertLength();
    }

    function convertLength() {
        const amount = parseFloat(lengthAmountInput.value);
        const fromSymbol = fromLengthUnitSelect.value;
        const toSymbol = toLengthUnitSelect.value;

        if (isNaN(amount) || amount <= 0) {
            lengthConverterResultDiv.innerHTML = 'Please enter a valid amount.';
            return;
        }

        const fromUnit = lengthUnits.find(unit => unit.symbol === fromSymbol);
        const toUnit = lengthUnits.find(unit => unit.symbol === toSymbol);

        if (!fromUnit || !toUnit) {
            lengthConverterResultDiv.innerHTML = 'Invalid unit selected.';
            return;
        }

        const amountInMeters = amount * fromUnit.toMeterFactor;

        const convertedAmount = amountInMeters / toUnit.toMeterFactor;

        lengthConverterResultDiv.innerHTML = `<strong>${convertedAmount.toFixed(4)} ${toUnit.symbol}</strong><span class="rate">(${amount} ${fromUnit.symbol})</span>`;
    }

    lengthAmountInput.addEventListener('input', convertLength);
    fromLengthUnitSelect.addEventListener('change', convertLength);
    toLengthUnitSelect.addEventListener('change', convertLength);
    swapLengthButton.addEventListener('click', () => {
        [fromLengthUnitSelect.value, toLengthUnitSelect.value] = [toLengthUnitSelect.value, fromLengthUnitSelect.value];
        convertLength();
    });

    populateLengthDropdowns();
}

const dataUnits = [
    { name: 'Bit', symbol: 'b', toBitFactor: 1 },
    { name: 'Byte', symbol: 'B', toBitFactor: 8 },
    { name: 'Kilobit', symbol: 'kb', toBitFactor: 1000 },
    { name: 'Kilobyte', symbol: 'KB', toBitFactor: 8000 },
    { name: 'Megabit', symbol: 'Mb', toBitFactor: 1e+6 },
    { name: 'Megabyte', symbol: 'MB', toBitFactor: 8e+6 },
    { name: 'Gigabit', symbol: 'Gb', toBitFactor: 1e+9 },
    { name: 'Gigabyte', symbol: 'GB', toBitFactor: 8e+9 },
    { name: 'Terabit', symbol: 'Tb', toBitFactor: 1e+12 },
    { name: 'Terabyte', symbol: 'TB', toBitFactor: 8e+12 },
];

function setupDataConverter() {
    const fromDataUnitSelect = document.getElementById('from-data-unit');
    const toDataUnitSelect = document.getElementById('to-data-unit');
    const dataAmountInput = document.getElementById('data-amount');
    const dataConverterResultDiv = document.getElementById('data-converter-result');
    const swapDataButton = document.getElementById('swap-data-button');

    function populateDataDropdowns() {
        dataUnits.forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit.symbol;
            option1.textContent = `${unit.name} (${unit.symbol})`;
            fromDataUnitSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = unit.symbol;
            option2.textContent = `${unit.name} (${unit.symbol})`;
            toDataUnitSelect.appendChild(option2);
        });

        fromDataUnitSelect.value = 'MB';
        toDataUnitSelect.value = 'KB';
        convertData();
    }

    function convertData() {
        const amount = parseFloat(dataAmountInput.value);
        const fromSymbol = fromDataUnitSelect.value;
        const toSymbol = toDataUnitSelect.value;

        if (isNaN(amount) || amount < 0) {
            dataConverterResultDiv.innerHTML = 'Please enter a valid amount.';
            return;
        }

        const fromUnit = dataUnits.find(unit => unit.symbol === fromSymbol);
        const toUnit = dataUnits.find(unit => unit.symbol === toSymbol);

        const amountInBits = amount * fromUnit.toBitFactor;
        const convertedAmount = amountInBits / toUnit.toBitFactor;

        dataConverterResultDiv.innerHTML = `<strong>${convertedAmount.toLocaleString()} ${toUnit.symbol}</strong><span class="rate">(${amount.toLocaleString()} ${fromUnit.symbol})</span>`;
    }

    dataAmountInput.addEventListener('input', convertData);
    fromDataUnitSelect.addEventListener('change', convertData);
    toDataUnitSelect.addEventListener('change', convertData);
    swapDataButton.addEventListener('click', () => {
        [fromDataUnitSelect.value, toDataUnitSelect.value] = [toDataUnitSelect.value, fromDataUnitSelect.value];
        convertData();
    });

    populateDataDropdowns();
}

function setupTemperatureConverter() {
    const fromTempUnitSelect = document.getElementById('from-temp-unit');
    const toTempUnitSelect = document.getElementById('to-temp-unit');
    const tempAmountInput = document.getElementById('temp-amount');
    const tempConverterResultDiv = document.getElementById('temp-converter-result');
    const swapTempButton = document.getElementById('swap-temp-button');

    const tempUnits = ['Celsius', 'Fahrenheit', 'Kelvin'];

    function populateTempDropdowns() {
        tempUnits.forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit;
            option1.textContent = unit;
            fromTempUnitSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = unit;
            option2.textContent = unit;
            toTempUnitSelect.appendChild(option2);
        });

        fromTempUnitSelect.value = 'Celsius';
        toTempUnitSelect.value = 'Fahrenheit';
        convertTemperature();
    }

    function convertTemperature() {
        const amount = parseFloat(tempAmountInput.value);
        const fromUnit = fromTempUnitSelect.value;
        const toUnit = toTempUnitSelect.value;

        if (isNaN(amount)) {
            tempConverterResultDiv.innerHTML = 'Please enter a valid number.';
            return;
        }

        if (fromUnit === toUnit) {
            tempConverterResultDiv.innerHTML = `<strong>${amount.toFixed(2)} °${toUnit.charAt(0)}</strong>`;
            return;
        }

        let amountInCelsius;

        if (fromUnit === 'Fahrenheit') {
            amountInCelsius = (amount - 32) * 5 / 9;
        } else if (fromUnit === 'Kelvin') {
            amountInCelsius = amount - 273.15;
        } else { 
            amountInCelsius = amount;
        }

        let convertedAmount;
        if (toUnit === 'Fahrenheit') {
            convertedAmount = (amountInCelsius * 9 / 5) + 32;
        } else if (toUnit === 'Kelvin') {
            convertedAmount = amountInCelsius + 273.15;
        } else { 
            convertedAmount = amountInCelsius;
        }

        tempConverterResultDiv.innerHTML = `<strong>${convertedAmount.toFixed(2)} °${toUnit.charAt(0)}</strong><span class="rate">(${amount.toFixed(2)} °${fromUnit.charAt(0)})</span>`;
    }

    tempAmountInput.addEventListener('input', convertTemperature);
    fromTempUnitSelect.addEventListener('change', convertTemperature);
    toTempUnitSelect.addEventListener('change', convertTemperature);
    swapTempButton.addEventListener('click', () => {
        [fromTempUnitSelect.value, toTempUnitSelect.value] = [toTempUnitSelect.value, fromTempUnitSelect.value];
        convertTemperature();
    });

    populateTempDropdowns();
}

function setupBMICalculator() {
    const weightInput = document.getElementById('weight-input');
    const weightUnitSelect = document.getElementById('weight-unit-select');
    const heightInput = document.getElementById('height-input');
    const heightUnitSelect = document.getElementById('height-unit-select');
    const calculateBmiBtn = document.getElementById('calculate-bmi-btn');
    const bmiResultDiv = document.getElementById('bmi-result');

    function calculateBMI() {
        let weight = parseFloat(weightInput.value);
        let height = parseFloat(heightInput.value);
        const weightUnit = weightUnitSelect.value;
        const heightUnit = heightUnitSelect.value;

        if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
            bmiResultDiv.innerHTML = 'Please enter valid positive values for weight and height.';
            return;
        }

        if (weightUnit === 'lbs') {
            weight *= 0.453592; 
        }

        if (heightUnit === 'cm') {
            height /= 100; 
        } else if (heightUnit === 'inches') {
            height *= 0.0254; 
        }

        const bmi = weight / (height * height);
        let bmiCategory = '';

        if (bmi < 18.5) {
            bmiCategory = 'Underweight';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            bmiCategory = 'Normal weight';
        } else if (bmi >= 25 && bmi < 29.9) {
            bmiCategory = 'Overweight';
        } else {
            bmiCategory = 'Obesity';
        }

        bmiResultDiv.innerHTML = `
            <strong>BMI: ${bmi.toFixed(2)}</strong><br>
            <span class="rate">Category: ${bmiCategory}</span>
        `;
    }

    weightInput.value = 70; 
    weightUnitSelect.value = 'kg';
    heightInput.value = 175; 
    heightUnitSelect.value = 'cm';
    calculateBMI();

    weightInput.addEventListener('input', calculateBMI);
    weightUnitSelect.addEventListener('change', calculateBMI);
    heightInput.addEventListener('input', calculateBMI);
    heightUnitSelect.addEventListener('change', calculateBMI);
    calculateBmiBtn.addEventListener('click', calculateBMI);
}

function setupDateCalculator() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const calculateBtn = document.getElementById('calculate-date-btn');
    const dateResultDiv = document.getElementById('date-result');

    const today = new Date();
    endDateInput.valueAsDate = today;
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    startDateInput.valueAsDate = oneMonthAgo;

    function calculateDateDifference() {
        const startDate = startDateInput.valueAsDate;
        const endDate = endDateInput.valueAsDate;

        if (!startDate || !endDate) {
            dateResultDiv.innerHTML = 'Please select both a start and end date.';
            return;
        }

        if (endDate < startDate) {
            dateResultDiv.innerHTML = 'End date must be after the start date.';
            return;
        }

        let tempStartDate = new Date(startDate);
        let years = endDate.getFullYear() - tempStartDate.getFullYear();
        let months = endDate.getMonth() - tempStartDate.getMonth();
        let days = endDate.getDate() - tempStartDate.getDate();

        if (days < 0) {
            months--;
            const lastDayOfPrevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
            days += lastDayOfPrevMonth;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        let resultString = 'Difference: ';
        const parts = [];
        if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
        if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (parts.length === 0) {
            resultString += '0 days';
        } else {
            resultString += parts.join(', ');
        }

        dateResultDiv.innerHTML = `<strong>${resultString}</strong>`;
    }

    calculateBtn.addEventListener('click', calculateDateDifference);
}

function setupTipCalculator() {
    const billAmountInput = document.getElementById('bill-amount');
    const tipPercentageInput = document.getElementById('tip-percentage');
    const tipPercentageValue = document.getElementById('tip-percentage-value');
    const splitCountInput = document.getElementById('split-count');
    const tipResultDiv = document.getElementById('tip-result');

    function calculateTip() {
        const billAmount = parseFloat(billAmountInput.value);
        const tipPercentage = parseInt(tipPercentageInput.value, 10);
        const splitCount = parseInt(splitCountInput.value, 10);

        tipPercentageValue.textContent = `${tipPercentage}%`;

        if (isNaN(billAmount) || billAmount < 0 || isNaN(splitCount) || splitCount < 1) {
            tipResultDiv.innerHTML = 'Please enter valid positive numbers.';
            return;
        }

        const tipAmount = billAmount * (tipPercentage / 100);
        const totalBill = billAmount + tipAmount;
        const amountPerPerson = totalBill / splitCount;

        const currencyFormat = { style: 'currency', currency: 'USD' }; 

        tipResultDiv.innerHTML = `
            <div>Tip Amount: <strong>${tipAmount.toLocaleString(undefined, currencyFormat)}</strong></div>
            <div>Total Bill: <strong>${totalBill.toLocaleString(undefined, currencyFormat)}</strong></div>
            ${splitCount > 1 ? `<div>Per Person: <strong>${amountPerPerson.toLocaleString(undefined, currencyFormat)}</strong></div>` : ''}
        `;
    }

    billAmountInput.addEventListener('input', calculateTip);
    tipPercentageInput.addEventListener('input', calculateTip);
    splitCountInput.addEventListener('input', calculateTip);

    calculateTip();
}

function setupLoanCalculator() {
    const loanAmountInput = document.getElementById('loan-amount');
    const interestRateInput = document.getElementById('interest-rate');
    const loanTermInput = document.getElementById('loan-term');
    const calculateLoanBtn = document.getElementById('calculate-loan-btn');
    const loanResultDiv = document.getElementById('loan-result');

    function calculateLoan() {
        const principal = parseFloat(loanAmountInput.value);
        const annualInterestRate = parseFloat(interestRateInput.value);
        const loanTermYears = parseInt(loanTermInput.value, 10);

        if (isNaN(principal) || principal <= 0 || isNaN(annualInterestRate) || annualInterestRate < 0 || isNaN(loanTermYears) || loanTermYears <= 0) {
            loanResultDiv.innerHTML = 'Please enter valid positive numbers for all fields.';
            return;
        }

        const monthlyInterestRate = (annualInterestRate / 100) / 12;
        const numberOfPayments = loanTermYears * 12;
        const currencyFormat = { style: 'currency', currency: 'USD' }; 

        let monthlyPayment;
        if (monthlyInterestRate === 0) { 
            monthlyPayment = principal / numberOfPayments;
        } else {
            const factor = Math.pow(1 + monthlyInterestRate, numberOfPayments);
            monthlyPayment = principal * (monthlyInterestRate * factor) / (factor - 1);
        }

        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;

        loanResultDiv.innerHTML = `
            <div>Monthly Payment: <strong>${monthlyPayment.toLocaleString(undefined, currencyFormat)}</strong></div>
            <div>Total Payment: <strong>${totalPayment.toLocaleString(undefined, currencyFormat)}</strong></div>
            <div>Total Interest: <strong>${totalInterest.toLocaleString(undefined, currencyFormat)}</strong></div>
        `;
    }

    loanAmountInput.addEventListener('input', calculateLoan);
    interestRateInput.addEventListener('input', calculateLoan);
    loanTermInput.addEventListener('input', calculateLoan);
    calculateLoanBtn.addEventListener('click', calculateLoan);

    calculateLoan();
}

function setupPercentageCalculator() {
    const percentageInput = document.getElementById('percentage-input');
    const numberInput = document.getElementById('percentage-of-input');
    const resultDiv = document.getElementById('percentage-result');

    function calculatePercentage() {
        const percent = parseFloat(percentageInput.value);
        const number = parseFloat(numberInput.value);

        if (isNaN(percent) || isNaN(number)) {
            resultDiv.innerHTML = 'Enter both values';
            return;
        }

        const result = (percent / 100) * number;

        resultDiv.innerHTML = `<strong>${result.toLocaleString()}</strong>`;
    }

    percentageInput.addEventListener('input', calculatePercentage);
    numberInput.addEventListener('input', calculatePercentage);

    calculatePercentage();
}

function setupDiscountCalculator() {
    const originalPriceInput = document.getElementById('original-price');
    const discountPercentageInput = document.getElementById('discount-percentage');
    const discountResultDiv = document.getElementById('discount-result');

    function calculateDiscount() {
        const originalPrice = parseFloat(originalPriceInput.value);
        const discountPercent = parseFloat(discountPercentageInput.value);

        if (isNaN(originalPrice) || originalPrice < 0 || isNaN(discountPercent) || discountPercent < 0) {
            discountResultDiv.innerHTML = 'Please enter valid positive numbers.';
            return;
        }

        const amountSaved = originalPrice * (discountPercent / 100);
        const finalPrice = originalPrice - amountSaved;

        const currencyFormat = { style: 'currency', currency: 'USD' }; 

        discountResultDiv.innerHTML = `
            <div>Final Price: <strong>${finalPrice.toLocaleString(undefined, currencyFormat)}</strong></div>
            <div class="rate">You Saved: <strong>${amountSaved.toLocaleString(undefined, currencyFormat)}</strong></div>
        `;
    }

    originalPriceInput.addEventListener('input', calculateDiscount);
    discountPercentageInput.addEventListener('input', calculateDiscount);

    calculateDiscount();
}