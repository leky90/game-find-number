
export class GameSound {
    #sounds: Record<string, HTMLAudioElement> = {}

    create({ key, src }: { key: string, src: string }) {
        this.#sounds[key] = new Audio(src)
    }

    play({ key }: { key: string }) {
        this.#sounds[key].pause();
        this.#sounds[key].currentTime = 0;
        this.#sounds[key].play()
    }
}