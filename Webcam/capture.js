(function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    var streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;
  
    function startup() {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
  
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
  
      startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
      }, false);
      
      clearphoto();
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
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

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
      if (width && height) {
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
          })
          .catch(function (response) {
              //handle error
              console.log(response);
          });


        // console.log(data);

        // axios.post('http://localhost:5001/', {
        //         'files': [{'file': data}]
        //     })
        //     .then(response => {
        //         console.log(response.data);
        //     })
        //     .catch(error => console.error(error));

        // data = data.split("base64,")[1];
        // console.log(data);

        // const url = 'http://localhost:5001/';

        // var file = {"file": data}

        // const formData = new FormData();
        // formData.append('file', file);

        // try {
        //     axios({
        //         method: 'POST',
        //         url: url,
        //         body: formData,

        //     })
        //         .then(response => {
        //             console.log(response.data);
        //         })
        //         .then(data => {
        //             console.log(data);
        //         }).catch(error => {
        //             console.log(error);
        //         });;
        // }

        // catch (error) {
        //     console.error('Error:', error);
        // }

        
        // fileUpload(file)
        //     .then(response => {
        //         console.log(response.data);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })

        // var file = {"file": data}

        // function fileUpload(file) {
        //     const url = 'http://localhost:5001/';
        //     const formData = new FormData();
        //     formData.append('files',file)
        //     const config = {
        //         headers: {
        //             'content-type': 'multipart/form-data'
        //         }
        //     }
        //     return  axios.post(url, formData,config)
        // }



      } else {
        clearphoto();
      }
    }

    
  
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
  })();