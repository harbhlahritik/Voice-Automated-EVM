const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// setting display properties of all the divs
const first = document.querySelector('.first');
const second = document.querySelector('.second');
const third = document.querySelector('.third');
const forth = document.querySelector('.forth');
const fifth = document.querySelector('.fifth');
const refresh = document.querySelector('.refresh');

second.style.display = 'none';
third.style.display = 'none';
forth.style.display = 'none';
fifth.style.display = 'none';
refresh.style.display = 'none';

// voice functions and functionality

const button = document.querySelector('.talk');

function speech(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.volume = 1;
    // speech.rate = 0.8;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

button.addEventListener('click', () => {
    recognition.start();
});

recognition.onstart = () => {
    console.log("Voice is activated");
};

var electoralNumber = null;
var getNumber = true;
var getConfirmation = false;
var getOption = false;

recognition.onresult = (event) => {
    console.log(event);
    const current = event.resultIndex;
    var transcript = event.results[current][0].transcript;


    console.log("transcript: "+transcript);
    console.log(typeof transcript);

    var number = transcript.replace(/\s+/g,'');
    console.log("transcript formatted: "+number);
    response.textContent = number;
    electoralNumber = parseInt(number, 10);
    console.log("electoralNumber: "+electoralNumber);
    window.setTimeout(number_verification, 1000);
};


// greetings voice

const greetingText = "Welcome to Voice Automated Electoral Voting Machine EVM Demo. To begin the voting process you need to provide your Electoral voting number. Once ready press the below button";
// speech(greetingText);

// Electoral number verification

function number_verification(electoralNumber) {
    greetings.innerHTML = null;

    const numberVerification = document.querySelector('.number-verification');
    numberVerification.querySelector('p').innerHTML = electoralNumber;
}


// option display

// option verification

// Completion confirmation