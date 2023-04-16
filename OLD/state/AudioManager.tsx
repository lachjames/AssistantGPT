export class AudioManager {
    audioQueue: HTMLAudioElement[];
    currentAudio: HTMLAudioElement | null;
    isPlaying: boolean;
    isInterrupted: boolean;

    constructor() {
        this.audioQueue = [];
        this.currentAudio = null;
        this.isPlaying = false;
        this.isInterrupted = false;
    }

    addToQueue(audio: HTMLAudioElement) {
        this.audioQueue.push(audio);
        if (!this.isPlaying) {
            this.playNext();
        }
    }

    async playNext() {
        if (this.audioQueue.length > 0) {
            const nextAudio = this.audioQueue.shift();
            if (nextAudio) {
                this.isPlaying = true;
                this.currentAudio = nextAudio;
                await this.playAudio(nextAudio);
                this.isPlaying = false;
                if (!this.isInterrupted) {
                    this.playNext();
                } else {
                    this.isInterrupted = false;
                }
            }
        }
    }

    playAudio(audio: HTMLAudioElement): Promise<void> {
        return new Promise((resolve) => {
            audio.play();
            audio.addEventListener("ended", () => {
                resolve();
            });
        });
    }

    interrupt(audio: HTMLAudioElement) {
        this.audioQueue = []; // Clear the queue
        if (this.currentAudio) {
            this.currentAudio.pause(); // Stop the current audio
            this.currentAudio.currentTime = 0; // Reset the current audio's time
        }
        this.currentAudio = audio;
        this.isInterrupted = true;
        this.playAudio(audio).then(() => {
            this.isPlaying = false;
            this.playNext(); // Continue playing the next audio in the queue after the interrupting audio has finished
        });
    }
}