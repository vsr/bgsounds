import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";

@customElement("audio-bit")
export class AudioBit extends LitElement {
  @state()
  private _volume = 0;

  set volume(val: number) {
    this._volume = val;
    this._updateAudioVolume(val);
    const inputEl = this.inputRangeRef.value;
    if (inputEl) {
      inputEl.value = String(val);
    }
  }

  @property()
  get volume() {
    return this._volume;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  @property({ type: String })
  audioPath = null;

  @property({ type: String })
  name = "";

  @property({ type: Boolean })
  playing = false;

  audioRef: Ref<HTMLAudioElement> = createRef();
  inputRangeRef: Ref<HTMLInputElement> = createRef();

  private volumechange(e: InputEvent) {
    const volume = parseFloat((e.target as HTMLInputElement)?.value);
    this._updateAudioVolume(volume);
    this._volume = volume;
  }
  private _updateAudioVolume(volume: number) {
    const audioEl = this.audioRef.value;
    if (audioEl) {
      audioEl.volume = volume;
    }
    if (volume > 0 && this.playing) {
      this.play();
    } else {
      this.pause();
    }
  }
  play() {
    this.audioRef.value?.play();
  }
  pause() {
    this.audioRef.value?.pause();
  }
  get paused() {
    return this.audioRef.value?.paused;
  }

  render() {
    return html`
      <div class="audio-bit">
        <figure>
          <figcaption>${this.name}</figcaption>
          <audio
            loop="true"
            ${ref(this.audioRef)}
            src="${this.audioPath}"
          ></audio>
          <label>
            <span class="label-text">Volume</span>
            <input
              @input=${this.volumechange}
              type="range"
              min="0"
              step="0.1"
              max="1"
              ${ref(this.inputRangeRef)}
            />
          </label>
        </figure>
      </div>
    `;
  }

  static styles = css`
    .audio-bit {
      border: 1px solid #333;
      border-radius: 0.5em;
      padding: 0.5em;
      color: var(--text-color);
      background-color: var(--bg-color);
      width: 100%;
      box-sizing: border-box;
    }
    label {
      display: flex;
      align-items: center;
    }
    .label-text {
      font-size: 0.8em;
      margin-inline-end: 0.5em;
    }
    figure {
      margin: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "audio-bit": AudioBit;
  }
}
