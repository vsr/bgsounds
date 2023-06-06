import { Ref } from "lit/directives/ref.js";
import { AudioBit } from "./audio-bit";

export interface AudioSource {
  path: string;
  volume: number;
  name: string;
  id: number;
  el: Ref<AudioBit>;
}

const sounds = [
  {
    path: "sounds/outdoor-farm.mp3",
    volume: 0.4,
    name: "Outdoor Farm",
    id: 1,
  },
  {
    path: "sounds/fire.m4a",
    volume: 0.4,
    name: "Fire",
    id: 2,
  },
];

export default sounds;
