const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// recognition.lang = "hi-IN";

var voices = [];
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
};

// setting display properties of all the divs
const first = document.querySelector('.first');
const second = document.querySelector('.second');
const third = document.querySelector('.third');
const forth = document.querySelector('.forth');
const fifth = document.querySelector('.fifth');
const confirm = document.querySelector('.confirm');

second.style.display = 'none';
third.style.display = 'none';
forth.style.display = 'none';
fifth.style.display = 'none';
confirm.style.display = 'none';

// voice functions and functionality

const button = document.querySelector('.talk');

function speech(text) {
    const speech = new SpeechSynthesisUtterance();
    // const speech = new window.SpeechSynthesis();
    console.log(speech);
    // speech.lang = "hi-IN";
    // speech.name = "Google US English";
    // speech.voice = voices[3];
    speech.text = text;
    speech.volume = 1;
    // speech.rate = 1.5;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
    // while(window.speechSynthesis.speaking){
    //     window.setTimeout( console.log("speaking..."), 1000);
    // } 
    // recognition.start();
}

button.addEventListener('click', () => {
    recognition.start();
    button.style.display = "none";
    document.querySelector(".refresh-button").style.left = "50%";
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
    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript;


    if(getNumber) {

        console.log('getNumber invoked');

        electoralNumber = parseInt(transcript.replace(/\s+/g,''), 10);

        getNumber = false;
        getConfirmation = true;
        
        window.setTimeout(verification(electoralNumber), 1000);

    } else if (getConfirmation) {

        console.log("getConfirmation invoked");

        if(transcript.includes('yes')){
            
            getConfirmation = false;
            getOption = true;

            window.setTimeout(getOptionfun, 1000);

        }

    } else if(getOption) {

        console.log("getoption invoked");

        getOption = false;
        var option = 0;
        
        if(transcript.includes('1') || transcript.includes('one')){
            option = 1;
        } else if (transcript.includes('2') || transcript.includes('two')){
            option = 2;
        } else if (transcript.includes('3') || transcript.includes('three')){
            option = 3;
        } else {
            option = 4;
        }

        window.setTimeout(optionVerification(option), 1000);


    } else {

        console.log("Confirm invoked");

        window.setTimeout(confirm_vote, 1000);

    }
};


// greetings voice

const greetingText = "Welcome to Voice Automated Electoral Voting Machine EVM Demo. To begin the voting process you need to provide your Electoral voting number. Once ready press the below Talk button.";
speech(greetingText);

// const getSpeech = () => {
//     if(window.speechSynthesis.speaking){
//         console.log("speaking....");
//         setTimeout(2000);
//     }
//     console.log("not speaking....");
//     recognition.start();
// };

// getSpeech();

// Electoral number verification

function verification(electoralNumber) {
    console.log("verification function invoked");

    second.style.display = 'block';

    const electoralNumberDisplay = document.querySelector('.electoralNumberDisplay');
    electoralNumberDisplay.textContent = electoralNumber;

    var userDetails = {
        "name": "New User",
        "age": null,
        "state": "Not Provided"
    };

    // get user data from electoral number
    if(electoralNumber == 123123123){

        userDetails.name = "Hritik Harbhla";
        userDetails.age = 21;
        userDetails.state = "Maharastra";

    } else if (electoralNumber == 123412341234) {

        userDetails.name = "Kundan Kumar";
        userDetails.age = 22;
        userDetails.state = "Delhi";

    } else {
        console.log("new User");
    }

    const name = document.querySelector(".name");
    const age = document.querySelector(".age");
    const state = document.querySelector(".state");
    name.textContent = "Name: "+ userDetails.name;
    age.textContent = "Age: "+ userDetails.age;
    state.textContent = "State: "+ userDetails.state;

    // var text = "Your electoral number is ";
    // speech(text);

    // var electoralNumberArray = electoralNumber.toString(10).split('').map(Number);
    // for(var i = 0;i < electoralNumberArray.length;i++){
    //     speech(electoralNumberArray[i]);
    // }

    text = "Your name is " + userDetails.name + " with age " + userDetails.age + " and belonging to State " + userDetails.state;
    speech(text);

    text = "Do you wish to proceed furthur ?";
    speech(text);

    window.setTimeout(() => {recognition.start();}, 8000);
}


// option display

function getOptionfun() {

    forth.style.display = "block";

    var text = "Please select one of the following options. Option 1 - Party 1, option 2 - party 2, option 3 - party 3, option 4 - nota. Say your option number to proceed.";
    speech(text);

    window.setTimeout(() => {recognition.start();}, 13000);
}

// option verification

function optionVerification(option) {

    fifth.style.display = "block";

    const showSelectedOption = document.querySelector(".showSelectedOption");
    showSelectedOption.textContent = "Option " + option;

    var text = "You have selected option number " + option;
    speech(text);

    text = "Say yes to confirm and cast the vote";
    speech(text);

    window.setTimeout(() => {recognition.start();}, 6000);
}

// Completion confirmation

function confirm_vote() {

    confirm.style.display = "block";
    document.querySelector(".refresh-button").style.left = "50%";
    document.querySelector(".refresh-button").style.top = "10px";

    var text = "Thank you for casting your vote. Press the button below for another demonstration.";
    speech(text);

    button.style.display = "none";
}