/**
 * Date: 20-12-2021
 * Author: Md. Masud Khan
 * Description: Color Picker application with huge DOM functionnalitis
 */

// Globals
let toastMessage = null;

const defaultColors = {
    red: 221,
    green: 222,
    blue: 238
}

const defaultPresetColors = [
    '#ffcdd2',
    '#f8bbd0',
    '#e1bee7',
    '#ff8a80',
    '#ff80ab',
    '#ea80fc',
    '#b39ddb',
    '#9fa8da',
    '#90caf9',
    '#b388ff',
    '#8c9eff',
    '#82b1ff',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#80d8ff',
    '#84ffff',
    '#a7ffeb',
    '#c8e6c9',
    '#dcedc8',
    '#f0f4c3',
    '#b9f6ca',
    '#ccff90',
    '#ffcc80'
];

let customColor = new Array(24);

const randomSound = new Audio('../Sound/random-sound.wav');

const copySound = new Audio('../Sound/copy-sound.wav');

// onload handler
window.onload = () => {
    main();
    updateColorCodeToDom(defaultColors);
    // display preset colors
    displayColorBoxes(document.getElementById('preset-colors'),defaultPresetColors);
    // local storage custom color
    const customColorsString = localStorage.getItem('custom-colors');
    if(customColorsString) {
        customColor = JSON.parse(customColorsString);
        displayColorBoxes(document.getElementById('custom-colors'), customColor)
    }
}

// main or boot function, this function will take care of getting all the dom references
function main() {
    // Dom references
    const generateRandomColorBtn = document.getElementById('generate-random-color');
    const inputHexInp = document.getElementById('input-hex');
    const colorSliderRed = document.getElementById('color-slider-red');
    const colorSliderGreen = document.getElementById('color-slider-green');
    const colorSliderBlue = document.getElementById('color-slider-blue');
    const copyToClipboardButton = document.getElementById('copy-to-clipboard');
    const presetColorsParent = document.getElementById('preset-colors');
    const customColorParent = document.getElementById('custom-colors');
    const saveToCustomBtn = document.getElementById('save-to-custom-btn');
    const bgFileInput = document.getElementById('bg-file-input');
    const bgFileInputBtn = document.getElementById('bg-file-input-btn');
    const bgPreview = document.getElementById('bg-preview');
    const bgFileDeleteBtn = document.getElementById('bg-file-delete-btn');
    bgFileDeleteBtn.style.display = 'none';
    const bgController = document.getElementById('bg-controller');
    bgController.style.display = 'none';

    // event listeners
    generateRandomColorBtn.addEventListener('click', handleGenerateRandomColorBtn);

    inputHexInp.addEventListener('keyup', handleInputHexInp);

    colorSliderRed.addEventListener('change', handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));
    colorSliderGreen.addEventListener('change', handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));
    colorSliderBlue.addEventListener('change', handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));

    copyToClipboardButton.addEventListener('click', handleCopyToClipboardButton);

    presetColorsParent.addEventListener('click', handlePresetColorsParent);

    customColorParent.addEventListener('click', handlePresetColorsParent);

    saveToCustomBtn.addEventListener('click', handleSavetoCustomBtn(customColorParent, inputHexInp));

    bgFileInputBtn.addEventListener('click', function() {
        bgFileInput.click();
    });

    bgFileInput.addEventListener('change', handleBgFileInput(bgPreview, bgFileDeleteBtn, bgFileInput, bgController));

    bgFileDeleteBtn.addEventListener('click', handleBgFileDeleteBtn(bgPreview, bgFileDeleteBtn, bgController));

    document.getElementById('bg-size').addEventListener('change', changeBackgroundPreferences);
    document.getElementById('bg-repeat').addEventListener('change', changeBackgroundPreferences);
    document.getElementById('bg-position').addEventListener('change', changeBackgroundPreferences);
    document.getElementById('bg-attachment').addEventListener('change', changeBackgroundPreferences);

}


// Event Handlers
function handleGenerateRandomColorBtn() {
    const colorObject = generateDecimalColor();
    updateColorCodeToDom(colorObject);
    randomSound.play();
    randomSound.volume = 0.3;
}

function handleInputHexInp(event) {
    const hexColor = event.target.value;
    if(hexColor) {
        this.value = hexColor.toUpperCase();
        if(isValidHex(hexColor)) {
            const colorObject = hexToDecimalColor(hexColor);
            updateColorCodeToDom(colorObject);
        }
    }
}

function handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue) {
    return function() {
        const colorObject = {
            red: parseInt(colorSliderRed.value),
            green: parseInt(colorSliderGreen.value),
            blue: parseInt(colorSliderBlue.value)
        }
        updateColorCodeToDom(colorObject);
    }
}

function handleCopyToClipboardButton() {
    const colorModeRedios = document.getElementsByName('color-mode');
    const mode = getCheckedValueFromRadios(colorModeRedios);
    if(mode === null) {
        throw new Error('Invalid input radio.');
    }
    if(toastMessage !== null) {
        toastMessage.remove();
        toastMessage = null;
    }
    if(mode === 'hex') {
        const hexColor = document.getElementById('input-hex').value;
        if(hexColor && isValidHex(hexColor)) {
            navigator.clipboard.writeText(`#${hexColor}`);
            generateToastMessage(`#${hexColor} Copied`);
            copySound.play();
            copySound.volume = 0.3;
        } else {
            alert('Invalid Hex Code');
        }
    } else {
        const rgbColor = document.getElementById('input-rgb').value;
        if(rgbColor) {
            navigator.clipboard.writeText(rgbColor);
            generateToastMessage(`${rgbColor} Copied`);
            copySound.play();
            copySound.volume = 0.3;
        } else {
            alert('Invalid RGB Color');
        }
    }
}

function handlePresetColorsParent(event) {
    const child = event.target;
    if(toastMessage !== null) {
        toastMessage.remove();
        toastMessage = null;
    }
    if(child.className === 'color-box') {
        navigator.clipboard.writeText(child.getAttribute('data-color'));
        generateToastMessage(`${child.getAttribute('data-color')} Copied`);
        copySound.play();
        copySound.volume = 0.3;
    }
}





function handleSavetoCustomBtn(customColorParent, inputHex) {
    return function() {
        const color = `#${inputHex.value}`;
        if(toastMessage !== null) {
            toastMessage.remove();
            toastMessage = null;
        }
        if(customColor.includes(color)) {
            generateToastMessage(`${color} Already saved`);
            return;
        } 
        customColor.unshift(color);
        if(customColor.length > 24) {
            customColor = customColor.slice(0, 24);
            copySound.play();
            copySound.volume = 0.3;
            generateToastMessage(`${color} has been saved`);
        }
        localStorage.setItem('custom-colors', JSON.stringify(customColor));
        removeChildren(customColorParent);
        displayColorBoxes(customColorParent, customColor);
    }
}


function handleBgFileInput(bgPreview, bgFileDeleteBtn, bgFileInput, bgController) {
    return function(event) {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        bgPreview.style.background = `url(${imageUrl})`;
        document.body.style.background = `url(${imageUrl})`;
        bgFileDeleteBtn.style.display = 'inline';
        bgFileInput.value = null;
        bgController.style.display = 'block';
    }
}


function handleBgFileDeleteBtn(bgPreview, bgFileDeleteBtn, bgController) {
    return function() {
        bgPreview.style.background = 'none';
        bgPreview.style.backgroundColor = '#dddeee';
        document.body.style.background = 'none';
        document.body.style.backgroundColor = '#dddeee';
        bgFileDeleteBtn.style.display = 'none';
        bgController.style.display = 'none';
    }
}


// Dom functions

/**
 * generate a dynamic dom element to show a toast message
 * @param {object} msg 
 */
function generateToastMessage(msg) {
    toastMessage = document.createElement('div');
    toastMessage.innerText = msg;
    toastMessage.className= 'toast-message toast-message-slide-in';

    toastMessage.addEventListener('click', function() {
        toastMessage.classList.remove('toast-message-slide-in');
        toastMessage.classList.add('toast-message-slide-out');

        toastMessage.addEventListener('animationend', function() {
            toastMessage.remove();
            toastMessage = null;
        });
    });

    document.body.appendChild(toastMessage);
}

/**
 * update dom elements with calculated color values
 * @param {object} colorDecimalCode  
 */
function updateColorCodeToDom(colorDecimalCode) {
    const hexColor = generateHexColorCode(colorDecimalCode);
    const rgbColor = generateRGBColor(colorDecimalCode);

    document.getElementById('color-display').style.backgroundColor = `#${hexColor}`;
    document.getElementById('input-hex').value = hexColor;
    document.getElementById('input-rgb').value = rgbColor;
    document.getElementById('color-slider-red').value = colorDecimalCode.red;
    document.getElementById('color-slider-red-label').innerText = colorDecimalCode.red;
    document.getElementById('color-slider-green').value = colorDecimalCode.green;
    document.getElementById('color-slider-green-label').innerText = colorDecimalCode.green;
    document.getElementById('color-slider-blue').value = colorDecimalCode.blue;
    document.getElementById('color-slider-blue-label').innerText = colorDecimalCode.blue;
}

/**
 * find the checked elemets from a list of radio buttons
 * @param {Array} nodes 
 * @returns {string | null}
 */
function getCheckedValueFromRadios(nodes) {
    let checkedValue = null;
    for(let i = 0; i < nodes.length; i++) {
        if(nodes[i].checked) {
            checkedValue = nodes[i].value;
            break;
        }
    }
    return checkedValue;
}

/**
 * create a div element with class name color-box
 * @param {string} colorCode 
 * @returns {object}
 */
function generateColorBox(colorCode) {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.backgroundColor = colorCode;
    div.setAttribute('data-color', colorCode);

    return div;
}

/**
 * this function will create and append new color boxes to it's parent
 * @param {object} parent 
 * @param {Array} colors 
 */
function displayColorBoxes(parent, colors) {
    colors.forEach((color) => {
        if(isValidHex(color.slice(1))) {
            const colorBox = generateColorBox(color);
            parent.appendChild(colorBox);
        }
    });
}


/**
 * 
 * @param {object} parent 
 */
function removeChildren(parent) {
    let child = parent.lastElementChild;
    while(child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}


function changeBackgroundPreferences() {
    document.body.style.backgroundSize = document.getElementById('bg-size').value;
    document.body.style.backgroundRepeat = document.getElementById('bg-repeat').value;
    document.body.style.backgroundPosition = document.getElementById('bg-position').value;
    document.body.style.backgroundAttachment = document.getElementById('bg-attachment').value;
}


// Utils Function

/**
 * generate and return an object of three color decimal values
 * @returns {object}
 */
function generateDecimalColor() {
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);

    return {
        red,
        green,
        blue
    };
}

/**
 * take a color object of three decimal values and return a hexadecimal color code
 * @param {object} color
 * @returns {string}
 */
function generateHexColorCode( { red, green, blue } ) {
    const getTwoCode = (value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    }

    return `${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase();
}

/**
 * take a color object of three decimal values and return a rgb color code
 * @param {object} color 
 * @returns {string}
 */
function generateRGBColor( {red, green, blue} ) {
    return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * convert hex color to decimal color object
 * @param {string} hex 
 * @returns {object}
 */ 
function hexToDecimalColor(hex) {
    const red = parseInt(hex.slice(0,2), 16);
    const green = parseInt(hex.slice(2,4), 16);
    const blue = parseInt(hex.slice(4), 16);

    return {
        red,
        green,
        blue
    };
}

/**
 * validate hex color code
 * @param {string} color
 * @returns {boolean}
 */
 function isValidHex(color) {
    if (color.length !== 6)
        return false;
    return /^[0-9A-Fa-f]{6}$/i.test(color);
}
