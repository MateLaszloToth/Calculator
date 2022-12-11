const OPERATORS = ['+', '-', '*', '/'];

addEventListeners();

function addEventListeners() {
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
        button.addEventListener('pointerup', e => writeToDisplay(e.target.textContent));
    }
    window.addEventListener('keyup', e => handleKeyInput(e.key))
}

function writeToDisplay(valueToAdd) {
    const displayParagraph = document.querySelector('.display p');

    if (displayParagraph.textContent.includes('=')) {
        if (OPERATORS.concat(['.', '=']).includes(valueToAdd)) {
            displayParagraph.textContent = '0';
        } else {
            displayParagraph.textContent = valueToAdd;
        }
        displayParagraph.style.fontSize = '40px';
        return
    }

    if (valueToAdd === '=') {
        displayParagraph.textContent += ` = ${calculate(displayParagraph.textContent)}`;
        handlePossibleOverflow(displayParagraph);
        return;
    }

    if (!OPERATORS.includes(valueToAdd)) {
        if (valueToAdd === '.') {
            if (!OPERATORS.concat('.').includes(displayParagraph.textContent.slice(-1))) {
                let indexOfFirstOperator = 0;
                for (let i = displayParagraph.textContent.length; i > 0; i--) {
                    let currentChar = displayParagraph.textContent.charAt(i);
                    if (OPERATORS.includes(currentChar)) {
                        indexOfFirstOperator = i;
                        break;
                    }
                }
                const segmentBeforePeriod = displayParagraph.textContent.slice(indexOfFirstOperator);

                if (!segmentBeforePeriod.includes('.')) {
                    displayParagraph.textContent += valueToAdd;
                    handlePossibleOverflow(displayParagraph);
                }
            }
        } else {
            if (displayParagraph.textContent === '0') {
                displayParagraph.textContent = valueToAdd;
                handlePossibleOverflow(displayParagraph);
            } else {
                displayParagraph.textContent += valueToAdd;
                handlePossibleOverflow(displayParagraph);
            }
        }
    } else {
        const lastChar = displayParagraph.textContent.slice(-1);
        if (!OPERATORS.concat('.').includes(lastChar)) {
            displayParagraph.textContent += valueToAdd;
            handlePossibleOverflow(displayParagraph);
        }
    }
}

function handleKeyInput(key) {
    const isValidOperator = ['+', '-', '*', '/', '.', '=', 'Enter'].includes(key)
    const isNumber = (key >= '0' && key <= '9')
    if (isValidOperator || isNumber)
        writeToDisplay(key.replace('Enter', '='));
}


function handlePossibleOverflow(displayParagraph) {
    const display = document.querySelector('.display');
    if (display.clientWidth < (displayParagraph.clientWidth + 10) ||
        display.clientHeight < (displayParagraph.clientHeight +10)) {
        const displayedText = document.querySelector('.display p');
        let fontSize = window.getComputedStyle(displayedText).fontSize;
        let fontSizeAsNumber = Number(fontSize.slice(0, fontSize.length - 2));
        fontSizeAsNumber -= 5;
        displayedText.style.fontSize = `${fontSizeAsNumber}px`;
        displayedText.style.fontSize
        handlePossibleOverflow(displayParagraph);
    }
}

function calculate(text) {
    if (text.includes('+')) {
        const indexOfOperator = text.indexOf('+');
        return calculate(text.slice(0, indexOfOperator)) + calculate(text.slice(indexOfOperator + 1));
    }

    if (text.includes('-')) {
        const indexOfOperator = text.indexOf('-');
        return calculate(text.slice(0, indexOfOperator)) - calculate(text.slice(indexOfOperator + 1));
    }

    if (text.includes('*')) {
        const indexOfOperator = text.indexOf('*');
        return calculate(text.slice(0, indexOfOperator)) * calculate(text.slice(indexOfOperator + 1));
    }

    if (text.includes('/')) {
        const indexOfOperator = text.indexOf('/');
        return calculate(text.slice(0, indexOfOperator)) / calculate(text.slice(indexOfOperator + 1));
    }
    return Number(text);
}

