let currentInput = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
const display = document.getElementById('display');

function updateDisplay() {
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function deleteLastChar() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function appendNumber(num) {
    if (waitingForSecondOperand) {
        currentInput = num;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

function appendDecimal() {
    if (waitingForSecondOperand) {
        currentInput = '0.';
        waitingForSecondOperand = false;
        return;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function setOperation(op) {
    if (operator !== null && !waitingForSecondOperand) {
        calculate();
    }
    firstOperand = parseFloat(currentInput);
    operator = op;
    waitingForSecondOperand = true;
}

function appendPercentage() {
    const value = parseFloat(currentInput);
    currentInput = (value / 100).toString();
    updateDisplay();
}

function calculate() {
    if (operator === null || waitingForSecondOperand) return;
    
    const secondOperand = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            if (secondOperand === 0) {
                alert("Ошибка: деление на ноль!");
                clearDisplay();
                return;
            }
            result = firstOperand / secondOperand;
            break;
    }

    currentInput = result.toString();
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = true;
    updateDisplay();
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        handleButtonClick(value);
    });
});

function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.querySelector('.theme-toggle img');
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    // Меняем тему и иконку
    html.setAttribute('data-theme', newTheme);
    themeIcon.src = `icon/${newTheme === 'dark' ? 'sun' : 'moon-stars'}.svg`;
    localStorage.setItem('calculatorTheme', newTheme);
}

// Инициализация темы и иконки
function initTheme() {
    const savedTheme = localStorage.getItem('calculatorTheme') || 'light';
    const themeIcon = document.querySelector('.theme-toggle img');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.src = `icon/${savedTheme === 'dark' ? 'sun' : 'moon-stars'}.svg`;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    initTheme();
    
    // Назначаем обработчик клика на иконку
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
});


function handleButtonClick(value) {
    if (value === 'AC') {
        clearDisplay();
    } else if (value === 'C') {
        deleteLastChar();
    } else if (value === '%') {
        appendPercentage();
    } else if (['+', '-', '*', '/'].includes(value)) {
        setOperation(value);
    } else if (value === '=') {
        calculate();
    } else if (value === '.') {
        appendDecimal();
    } else if (!isNaN(value)) {
        appendNumber(value);
    }
}

updateDisplay();
