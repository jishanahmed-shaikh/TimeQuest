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
      this.currentAudio.play().catch(console.error);
    } catch (error) {
      console.error('Error playing one-time audio:', error);
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
      
      this.timerAudio.play().catch(console.error);
    } catch (error) {
      console.error('Error starting timer audio:', error);
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