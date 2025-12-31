import { useCallback, useRef } from "react";

const createOscillator = (
  audioContext: AudioContext,
  frequency: number,
  type: OscillatorType,
  duration: number,
  volume: number = 0.1
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback(() => {
    const ctx = getAudioContext();
    createOscillator(ctx, 800, "sine", 0.1, 0.05);
    setTimeout(() => createOscillator(ctx, 1000, "sine", 0.05, 0.03), 50);
  }, [getAudioContext]);

  const playSuccess = useCallback(() => {
    const ctx = getAudioContext();
    createOscillator(ctx, 523.25, "sine", 0.15, 0.08);
    setTimeout(() => createOscillator(ctx, 659.25, "sine", 0.15, 0.08), 100);
    setTimeout(() => createOscillator(ctx, 783.99, "sine", 0.2, 0.08), 200);
  }, [getAudioContext]);

  const playError = useCallback(() => {
    const ctx = getAudioContext();
    createOscillator(ctx, 200, "sawtooth", 0.3, 0.05);
    setTimeout(() => createOscillator(ctx, 150, "sawtooth", 0.3, 0.05), 150);
  }, [getAudioContext]);

  const playHover = useCallback(() => {
    const ctx = getAudioContext();
    createOscillator(ctx, 600, "sine", 0.05, 0.02);
  }, [getAudioContext]);

  const playLogin = useCallback(() => {
    const ctx = getAudioContext();
    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => createOscillator(ctx, freq, "sine", 0.2, 0.06), i * 80);
    });
  }, [getAudioContext]);

  return { playClick, playSuccess, playError, playHover, playLogin };
};
