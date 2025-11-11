import { helloWorld } from "./functions/helloWorld.js";
import { onProductCreated } from "./functions/imageProcessing.js";


// Add the function to the exported array:
export const functions = [
  helloWorld,
  onProductCreated,
];