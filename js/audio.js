/* ==========================================================================
   DREAMY SOUND SYNTHESIZER (Web Audio API)
   Generates soft kawaii bubble pops, fairy chimes & success tones
   ========================================================================== */

const KawaiiAudio = (function () {
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Soft Squishy Bubble Pop
  function playBubblePop() {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      // Bubble sweep
      const startFreq = 260 + Math.random() * 80;
      const endFreq = startFreq + 320 + Math.random() * 120;
      const now = audioCtx.currentTime;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  // Fairy Sparkle Chime
  function playFairyChime() {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const notes = [1046.5, 1318.51, 1567.98, 1975.53, 2093.0]; // C6, E6, G6, B6, C7
      const now = audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const noteTime = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.04, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.38);
      });
    } catch (e) {}
  }

  // Success Jingle for Form Submit
  function playSuccessJingle() {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const noteTime = now + idx * 0.1;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.08, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.5);
      });
    } catch (e) {}
  }

  function toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  }

  return {
    playBubblePop,
    playFairyChime,
    playSuccessJingle,
    toggleMute,
    isMuted: () => isMuted
  };
})();
