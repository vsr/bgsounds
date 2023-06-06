export interface PresetData {
  name: string;
  audio: {
    id: number;
    volume: number;
  }[];
}

const themes = [
  {
    name: "welcome",
    audio: [
      { id: 1, volume: 0.6 },
      { id: 2, volume: 0 },
    ],
  },
  {
    name: "Fire",
    audio: [
      { id: 1, volume: 0 },
      { id: 2, volume: 0.6 },
    ],
  },
];

export default themes;
