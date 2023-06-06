import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ref, createRef } from "lit/directives/ref.js";
import sounds, { AudioSource } from "./sounds";
import themes, { PresetData } from "./themes";

@customElement("bg-sounds")
export class BgSounds extends LitElement {
  private _sounds: AudioSource[] = sounds.map((sound) => ({
    ...sound,
    el: createRef(),
  }));
  private _presets: PresetData[] = themes;

  @state()
  preset = this._presets[0].name;

  @property({ type: Boolean })
  playing = false;

  connectedCallback() {
    super.connectedCallback();

    const preset = this.getPresetByName(this.preset);
    if (preset) {
      setTimeout(() => {
        // TODO: replace timeout hack to run after all audio-bit are rendered
        this.updateAudioWithPreset(preset);
      }, 500);
    }
  }

  play() {
    this.playing = true;
    this._sounds.forEach((sound) => {
      sound.el.value?.play();
    });
  }
  pause() {
    this.playing = false;
    this._sounds.forEach((sound) => sound.el.value?.pause());
  }
  togglePlay() {
    this.playing ? this.pause() : this.play();
  }
  onPresetChange(ev: InputEvent) {
    const presetName = (ev.target as HTMLSelectElement)?.value;
    this.preset = presetName;
    const preset = this.getPresetByName(presetName);
    if (preset) {
      this.updateAudioWithPreset(preset);
    }
  }
  getPresetByName(presetName: string) {
    return this._presets.find((p) => p.name === presetName);
  }
  updateAudioWithPreset(preset: PresetData) {
    preset.audio.forEach((audio) => {
      const sound = this._sounds.find((sound) => sound.id === audio.id);
      if (sound) {
        if (sound.el.value) sound.el.value.volume = audio.volume;
      }
    });
  }
  playLogo = html`<svg
    aria-label="Play"
    xmlns="http://www.w3.org/2000/svg"
    height="48"
    viewBox="0 -960 960 960"
    width="48"
  >
    <path
      d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"
    />
  </svg>`;
  pauseLogo = html`<svg
    aria-label="Pause"
    xmlns="http://www.w3.org/2000/svg"
    height="48"
    viewBox="0 -960 960 960"
    width="48"
  >
    <path
      d="M370-320h60v-320h-60v320Zm160 0h60v-320h-60v320ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"
    />
  </svg>`;

  render() {
    return html`
      <div class="container ${this.playing ? "playing" : "paused"}">
        <h1>Ambient Background Sounds</h1>
        <div class="text-center">
          <button @click=${this.togglePlay} class="play-pause-button">
            ${this.playing ? this.pauseLogo : this.playLogo}
          </button>
        </div>
        <label class="preset-selector"
          >Select a preset theme
          <select
            name="presets"
            value=${this.preset}
            @change=${this.onPresetChange}
          >
            ${this._presets.map(
              (preset) =>
                html`<option value=${preset.name}>${preset.name}</option>`
            )}
          </select>
        </label>
        <section class="audio-bits-section">
          <h2 id="audio-bits-list">Customize Background Sounds</h2>
          <ul class="audio-bits" aria-labelledby="audio-bits-list">
            ${this._sounds.map((sound) => {
              return html`
                <li>
                  <audio-bit
                    audioPath="${sound.path}"
                    volume="${sound.volume}"
                    name="${sound.name}"
                    ?playing=${this.playing}
                    ${ref(sound.el)}
                  />
                </li>
              `;
            })}
          </ul>
        </section>
      </div>
    `;
  }
  static styles = css`
    .container {
      padding: 1em;
      margin: 1em auto;
      border-radius: 1em;
      border: 1px solid #111;
      max-width: 32rem;
      min-width: 16rem;
      background-color: #222;
      color: #fff;
      font-family: inherit;
    }
    .container.playing {
    }
    h1 {
      font-size: 1.3em;
      line-height: 1.1em;
      font-weight: 600;
      margin-top: 0;
    }
    h2 {
      font-size: 1rem;
      line-height: 1.1em;
      margin: 0 0 0 0.5em;
    }
    .audio-bits {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
    }
    .audio-bits li {
      list-style-type: none;
      flex-grow: 1;
      margin: 0;
      padding: 0.5rem;
    }
    .play-pause-button {
      background: transparent;
      border: 0;
      fill: #fefefe;
    }
    .play-pause-button:hover,
    .play-pause-button:focus {
      fill: #dedede;
    }
    .play-pause-button svg {
      width: 6rem;
      height: 6rem;
    }
    .playing .play-pause-button svg {
    }
    .paused .play-pause-button svg {
    }
    .container {
      background: linear-gradient(
        45deg,
        #222 0%,
        #333 33%,
        #222 66%,
        #333 100%
      );
      background-size: 200% 200%;
      background-attachment: fixed;
    }
    .playing.container {
      animation: gradient 3s ease infinite alternate forwards;
    }
    .text-center {
      text-align: center;
    }
    .preset-selector {
      margin: 0 0.5em;
      display: flex;
      justify-content: center;
    }
    .preset-selector select {
      font-family: inherit;
      font-size: 0.9rem;
      margin-left: 0.5em;
      background: #444;
      color: inherit;
      border: 1px solid #888;
      border-radius: 0.5em;
      padding: 0.25em;
    }
    .audio-bits-section {
      margin: 1em auto;
      border-top: 1px solid #999;
      padding: 1em 0;
    }

    @keyframes gradient {
      0% {
        background-position: 0%;
      }
      100% {
        background-position: 100%;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "bg-sounds": BgSounds;
  }
}
