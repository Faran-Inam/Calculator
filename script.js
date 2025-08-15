// Modern Calculator Class
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Add event listeners to buttons
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.getAttribute('data-number'));
            animateButton(button);
        });
    });

    document.querySelectorAll('[data-operation]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.getAttribute('data-operation'));
            animateButton(button);
        });
    });

    document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
        calculator.calculate();
        animateButton(document.querySelector('[data-action="calculate"]'));
    });

    document.querySelector('[data-action="clear"]').addEventListener('click', () => {
        calculator.clear();
        animateButton(document.querySelector('[data-action="clear"]'));
    });

    document.querySelector('[data-action="delete"]').addEventListener('click', () => {
        calculator.delete();
        animateButton(document.querySelector('[data-action="delete"]'));
    });

    // Keyboard support
    document.addEventListener('keydown', event => {
        if (event.key >= 0 && event.key <= 9) calculator.appendNumber(event.key);
        if (event.key === '.') calculator.appendNumber('.');
        if (event.key === '+' || event.key === '-') calculator.chooseOperation(event.key === '+' ? '+' : '−');
        if (event.key === '*' || event.key === 'x') calculator.chooseOperation('×');
        if (event.key === '/') calculator.chooseOperation('÷');
        if (event.key === '%') calculator.chooseOperation('%');
        if (event.key === 'Enter' || event.key === '=') calculator.calculate();
        if (event.key === 'Backspace') calculator.delete();
        if (event.key === 'Escape') calculator.clear();
    });
});

// Button animation function
function animateButton(button) {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 150);
    
    // Add ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}