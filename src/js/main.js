import * as Hands from "@mediapipe/hands";
import * as DrawingUtils from "@mediapipe/drawing_utils";
import * as Vision from "@mediapipe/tasks-vision";

const AddToDom = (text) => {
    let par = document.createElement("p");
    let text_element = document.createTextNode(text);
    par.appendChild(text_element);
    document.getElementsByTagName('body')[0].appendChild(par);
}

const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

let runningMode = "IMAGE";
let handLandmarker = undefined;
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
await createHandLandmarker();
const image = document.getElementById("handImage");
canvasElement.width = image.width;
canvasElement.height = image.height;

const results = handLandmarker.detect(image);
canvasCtx.save();
canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
if (results.landmarks) {
    for (const landmarks of results.landmarks) {
        DrawingUtils.drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5
        });
        DrawingUtils.drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
    }
}
canvasCtx.restore();
export { AddToDom };
