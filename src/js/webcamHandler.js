let runningMode = "VIDEO";
let handLandmarker = undefined;
let video = undefined;
let lastVideoTime = -1;
let detectionCallback = (results) => { console.log(results); }

const InitWebcam = (_video, _handLandmarker, _detectionCallback) => {
    video = _video;
    handLandmarker = _handLandmarker;
    detectionCallback = _detectionCallback;

    // Check if webcam access is supported.
    const hasGetUserMedia = () => { var _a; return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); };
    // If webcam supported, add event listener to button for when user
    // wants to activate it.
    if (hasGetUserMedia()) {
        enableCam();
    }
    else {
        console.warn("getUserMedia() is not supported by your browser");
    }
}
// Enable the live webcam view and start detection.
const enableCam = () => {
    if (!handLandmarker) {
        console.log("Wait! objectDetector not loaded yet.");
        return;
    }
    // getUsermedia parameters.
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

async function predictWebcam() {
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await handLandmarker.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        const results = handLandmarker.detectForVideo(video, startTimeMs);
        detectionCallback(results);
    }

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
}

export { InitWebcam };
