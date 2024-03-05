import * as Hands from "@mediapipe/hands";
import * as DrawingUtils from "@mediapipe/drawing_utils";
import * as Vision from "@mediapipe/tasks-vision";
import * as WebcamHandler from "./webcamHandler.js";

const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const video = document.getElementById("webcam");


let runningMode = "VIDEO";
let handLandmarker = undefined;

const AddToDom = (text) => {
    let par = document.createElement("p");
    let text_element = document.createTextNode(text);
    par.appendChild(text_element);
    document.getElementsByTagName('body')[0].appendChild(par);
}

const DrawCircle = (p, canvas, context, radius, lineWidth, fillColor, lineColor) => {
    context.beginPath();
    context.arc(p.x * canvas.width, p.y * canvas.height, radius, 0, 2 * Math.PI, false);
    context.fillStyle = fillColor;
    context.fill();
    context.lineWidth = lineWidth;
    context.strokeStyle = lineColor;
    context.stroke();
}

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createHandLandmarker = async () => {
    const vision = await Vision.FilesetResolver.forVisionTasks("./js/tasks-vision_wasm");
    handLandmarker = await Vision.HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "./mediapipe_models/hand_landmarker.task",
            delegate: "GPU"
        },
        runningMode: runningMode,
        numHands: 2
    });
    AddToDom("HandLandmakrer loaded!");
};

const detectionCallback = (results) => {
    canvasElement.style.width = video.videoWidth;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.landmarks) {
        //console.log(results);
        for (const landmarks of results.landmarks) {
            DrawingUtils.drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 2
            });
            DrawingUtils.drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 0 });
            // See hand-landmarks.png in mediapipe_info folder
            // Ref: https://developers.google.com/mediapipe/solutions/vision/hand_landmarker
            // Thumb tip position
            DrawCircle(landmarks[4], canvasElement, canvasCtx, 8, 2, '#00aaff', '#ff00ff');
            // Index finger tip position
            DrawCircle(landmarks[8], canvasElement, canvasCtx, 8, 2, '#00ff00', '#00aaff');

        }
    }
    canvasCtx.restore();
}

await createHandLandmarker();
WebcamHandler.InitWebcam(video, handLandmarker, detectionCallback);

export { AddToDom };
