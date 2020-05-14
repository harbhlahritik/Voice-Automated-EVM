const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "hi-IN";

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
    console.log(speech);
    speech.lang = "hi-IN";
    speech.text = text;
    speech.volume = 1;
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

        if(transcript.includes('हां')){
            
            getConfirmation = false;
            getOption = true;

            window.setTimeout(getOptionfun, 1000);

        }

    } else if(getOption) {

        console.log("getoption invoked");

        getOption = false;
        var option = 0;
        
        if(transcript.includes('1')){
            option = 1;
        } else if (transcript.includes('2')){
            option = 2;
        } else if (transcript.includes('3')){
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

const greetingText = "नमस्ते चुनावी वोटिंग मशीन में आपका स्वागत है। मतदान प्रक्रिया शुरू करने के लिए आपको अपना चुनावी मतदान संख्या प्रदान करना होगा । एक बार तैयार होने के बाद नीचे के हरे बातचीत बटन को दबाएं"
speech(greetingText);

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

        userDetails.name = "रितिक Harbhla";
        userDetails.age = 21;
        userDetails.state = "महाराष्ट्र";

    } else if (electoralNumber == 123412341234) {

        userDetails.name = "कुंदन कुमार";
        userDetails.age = 22;
        userDetails.state = "दिल्ली";

    } else {
        console.log("new User");
    }

    const name = document.querySelector(".name");
    const age = document.querySelector(".age");
    const state = document.querySelector(".state");
    name.textContent = "नाम: "+ userDetails.name;
    age.textContent = "आयु: "+ userDetails.age;
    state.textContent = "राज्य: "+ userDetails.state;

    var text = "आपका चुनावी नंबर है "+ electoralNumber + ". आपका नाम है " + userDetails.name + " आयु " + userDetails.age + " और राज्य से संबंधित है " + userDetails.state;
    speech(text);

    text = "क्या आप आगे बढ़ना चाहते हैं?";
    speech(text);
}


// option display

function getOptionfun() {

    forth.style.display = "block";

    var text = "कृपया निम्न में से किसी एक विकल्प को चुनें. विकल्प 1 - पार्टी 1, विकल्प 2 - पार्टी 2, विकल्प 3 - पार्टी 3, विकल्प 4 - नोटा.आगे बढ़ने के लिए अपना विकल्प नंबर कहें।";
    speech(text);

}

// option verification

function optionVerification(option) {

    fifth.style.display = "block";

    const showSelectedOption = document.querySelector(".showSelectedOption");
    showSelectedOption.textContent = "Option " + option;

    var text = "आपने विकल्प नंबर चुना है " + option;
    speech(text);

    text = "वोट की पुष्टि करने और वोट देने के लिए हां कहें";
    speech(text);

}

// Completion confirmation

function confirm_vote() {

    confirm.style.display = "block";
    document.querySelector(".refresh-button").style.left = "45%";

    var text = "वोट डालने के लिए धन्यवाद। एक और प्रदर्शन के लिए नीचे दिया गया बटन दबाएं।";
    speech(text);

    button.style.display = "none";

}