/**
 * useSound — lightweight expo-av wrapper for playing UI sound effects.
 * Caches sound objects in memory for near-zero latency playback.
 * Gracefully no-ops on errors so screens can call it freely.
 */
import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { audio, type SoundName } from '@/constants/mediaAssets';

const soundObjects: Partial<Record<SoundName, Audio.Sound>> = {};
let initialized = false;

async function ensureAudioMode() {
  if (initialized) return;
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    initialized = true;
  } catch {
    // non-critical
  }
}

async function loadSound(name: SoundName): Promise<Audio.Sound | null> {
  if (soundObjects[name]) return soundObjects[name] ?? null;
  try {
    await ensureAudioMode();
    const remote = audio[name];
    if (!remote) return null;
    const { sound } = await Audio.Sound.createAsync(
      { uri: remote },
      { shouldPlay: false, isLooping: false, volume: 0.85 },
    );
    soundObjects[name] = sound;
    return sound;
  } catch {
    return null;
  }
}

export function useSound() {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const play = useCallback(async (name: SoundName) => {
    try {
      const sound = await loadSound(name);
      if (!sound || !mounted.current) return;
      await sound.replayAsync();
    } catch {
      // silent fail — sounds are non-critical
    }
  }, []);

  return { play };
}

/**
 * Preload commonly used sounds on app launch so first play is instant.
 */
export async function preloadSounds(names: SoundName[] = ['splashSound', 'successChime', 'errorThud']) {
  try {
    await ensureAudioMode();
    await Promise.all(names.map((n) => loadSound(n)));
  } catch {
    // non-critical
  }
}
