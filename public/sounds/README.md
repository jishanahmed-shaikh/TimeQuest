# Audio Files for TimeQuest

## Quick Fix for Live Deployment

If you're seeing this on the live website and audio isn't working, you can:

1. **Download free audio files** from these sources:
   - [Freesound.org](https://freesound.org) (search for "bell", "chime", "beep")
   - [Zapsplat.com](https://zapsplat.com) (free with registration)
   - [Pixabay Audio](https://pixabay.com/sound-effects/)

2. **Required audio files:**
   - `simple.wav` - Simple bell sound
   - `softbell.wav` - Soft bell sound  
   - `tingtong.wav` - Ting tong sound
   - `ticktockclose.wav` - Tick tock close sound
   - `retrogamingclock.wav` - Retro gaming clock sound
   - `sound1digital.mp3` - Digital sound

3. **Audio specifications:**
   - Duration: 0.5-2 seconds for completion sounds
   - Format: .wav, .mp3, or .ogg
   - Volume: Moderate (not too loud)
   - Quality: 44.1kHz, 16-bit minimum

## Alternative: Disable Audio

If you don't want to add audio files, the app will work fine without them. The audio system gracefully handles missing files.

## For Developers

To add audio files to your deployment:
1. Place audio files in this `public/sounds/` directory
2. Commit and push to your repository
3. Redeploy your application

The audio files will then be available at `/sounds/filename.wav` in your deployed app.