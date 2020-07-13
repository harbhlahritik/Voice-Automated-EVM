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
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const confirmation = document.querySelector('.confirmation_message');

second.style.display = 'none';
third.style.display = 'none';
forth.style.display = 'none';
fifth.style.display = 'none';
confirm.style.display = 'none';
video.style.display = 'none';
canvas.style.display = 'none';
photo.style.display = 'none';

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

        if(transcript.includes('हां')){
            
            getConfirmation = false;
            getOption = true;

            window.setTimeout(getOptionfun, 1000);

        }

    } else if(getOption) {

        console.log("getoption invoked");

        getOption = false;
        var option = 0;
        
        if(transcript.includes('1') || transcript.includes('एक')){
            option = 1;
        } else if (transcript.includes('2') || transcript.includes('दो')){
            option = 2;
        } else if (transcript.includes('3') || transcript.includes('तीन')){
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

    // var text = "आपका चुनावी नंबर है ";
    // speech(text);

    // var electoralNumberArray = electoralNumber.toString(10).split('').map(Number);
    // for(var i = 0;i < electoralNumberArray.length;i++){
    //     speech(electoralNumberArray[i]);
    // }

    text = "आपका नाम है " + userDetails.name + " आयु " + userDetails.age + " और राज्य से संबंधित है " + userDetails.state;
    speech(text);

    video.style.display = "block";
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    var streaming = false;

    startup();
    window.setTimeout(() => {
        takepicture();
    }, 14000)

    function startup() {

        navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });
  
        video.addEventListener('canplay', function(ev){
            if (!streaming) {
            height = video.videoHeight / (video.videoWidth/width);
            
            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.
            
            if (isNaN(height)) {
                height = width / (4/3);
            }
            
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
            }
        }, false);

        var text = "अपनी तस्वीर ले रहा है. कृपया अपना चित्र लेते हुए आगे देखें"
        speech(text);
        text = "3"
        speech(text);
        text = "2"
        speech(text);
        text = "1"
        speech(text);
    }

    // Fill the photo with an indication that none has been
    // captured.

    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    function base64ToBlob(base64, mime) 
    {
        mime = mime || '';
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        var byteArrays = [];

        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            var slice = byteChars.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: mime});
    }

    function takepicture() {
        var context = canvas.getContext('2d');
        photo.style.display = "block";
        if (width && height) {
            console.log("takepicture() if is satisfied");
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            
            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
    
            // data = data.split("base64,")[1];
            var bodyFormData = new FormData();
    
            var base64ImageContent = data.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            var blob = base64ToBlob(base64ImageContent, 'image/png');
    
            bodyFormData.append('file', blob); 
    
            axios({
            method: 'post',
            url: 'https://face-recognition-hritik.herokuapp.com/',
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(function (response) {
                //handle success
                console.log(response);
                // var json_data = JSON.parse(response);
                console.log(response.data.is_picture_of_hritik);
                // return response.data.is_picture_of_hritik;
                if(response.data.is_picture_of_hritik){
                    console.log("SUCCESS facial recognition");
                    let text = "चेहरे की पहचान सफलतापूर्वक हुई";
                    speech(text);
                    confirmation.style.display = "block";
                    text = "आगे बढ़ने के लिए हां कहो";
                    speech(text);
                    window.setTimeout(() => {recognition.start();}, 5500);
                } else {
                    console.log("facial recognition no match");
                    let text = "चेहरे की पहचान से कोई मेल नहीं मिला.";
                    speech(text);
                    text = "कृपया मतदान प्रक्रिया पुनः आरंभ करें";
                    speech(text);
                }
            })
            .catch(function (response) {
                //handle error
                console.log(response);
                return false;
            });
    
        } else {
            clearphoto();
        }
    }
}


// option display

function getOptionfun() {

    forth.style.display = "block";

    var text = "कृपया निम्न में से किसी एक विकल्प को चुनें. विकल्प 1 - पार्टी 1, विकल्प 2 - पार्टी 2, विकल्प 3 - पार्टी 3, विकल्प 4 - नोटा.आगे बढ़ने के लिए अपना विकल्प नंबर कहें।";
    speech(text);

    window.setTimeout(() => {recognition.start();}, 11000);
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

    window.setTimeout(() => {recognition.start();}, 6000);
}

// Completion confirmation

function confirm_vote() {

    confirm.style.display = "block";
    document.querySelector(".refresh-button").style.left = "50%";

    var text = "वोट डालने के लिए धन्यवाद। एक और प्रदर्शन के लिए नीचे दिया गया बटन दबाएं।";
    speech(text);

    button.style.display = "none";
}