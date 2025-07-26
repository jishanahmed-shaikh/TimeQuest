class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;
  private timerAudio: HTMLAudioElement | null = null;
  private isTimerRunning: boolean = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Play one-time audio (like completion sounds)
  playOneTimeAudio(audioFile: string, volume: number = 0.75): void {
    try {
      // Stop any currently playing one-time audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }

      this.currentAudio = new Audio(`/sounds/${audioFile}`);
      this.currentAudio.volume = volume;
      
      // Handle missing audio files gracefully
      this.currentAudio.onerror = () => {
        console.warn(`Audio file not found: ${audioFile}. Audio is optional and the app will work without it.`);
      };
      
      this.currentAudio.play().catch((error) => {
        console.warn(`Could not play audio: ${audioFile}. This is normal if audio files are not available.`);
      });
    } catch (error) {
      console.warn('Audio not available, continuing without sound:', error);
    }
  }

  // Start timer background audio (looping)
  startTimerAudio(audioFile: string, volume: number = 0.75): void {
    try {
      // Stop any existing timer audio
      this.stopTimerAudio();

      this.timerAudio = new Audio(`/sounds/${audioFile}`);
      this.timerAudio.volume = volume * 0.3; // Lower volume for background
      this.timerAudio.loop = true;
      this.isTimerRunning = true;
      
      // Handle missing audio files gracefully
      this.timerAudio.onerror = () => {
        console.warn(`Timer audio file not found: ${audioFile}. Timer will work silently.`);
        this.isTimerRunning = true; // Keep timer running, just without sound
      };
      
      this.timerAudio.play().catch((error) => {
        console.warn(`Could not play timer audio: ${audioFile}. Timer will work silently.`);
        this.isTimerRunning = true; // Keep timer running, just without sound
      });
    } catch (error) {
      console.warn('Timer audio not available, timer will work silently:', error);
      this.isTimerRunning = true; // Keep timer running, just without sound
    }
  }

  // Stop timer background audio
  stopTimerAudio(): void {
    if (this.timerAudio) {
      this.timerAudio.pause();
      this.timerAudio.currentTime = 0;
      this.timerAudio = null;
    }
    this.isTimerRunning = false;
  }

  // Pause timer audio
  pauseTimerAudio(): void {
    if (this.timerAudio) {
      this.timerAudio.pause();
    }
  }

  // Resume timer audio
  resumeTimerAudio(): void {
    if (this.timerAudio && this.isTimerRunning) {
      this.timerAudio.play().catch(console.error);
    }
  }

  // Stop all audio
  stopAllAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.stopTimerAudio();
  }

  // Check if timer is running
  isTimerAudioRunning(): boolean {
    return this.isTimerRunning;
  }
}

export default AudioManager;