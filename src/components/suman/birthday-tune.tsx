"use client";

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

// Happy Birthday in 3/4 — [note, length in beats]
const MELODY: [string, number][] = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 1],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
];

// soft chord under each bar (one per 3 beats, starting after the pickup)
const CHORDS: [string[], number][] = [
  [['C3', 'G3', 'E4'], 3], [['G2', 'D3', 'B3'], 3],
  [['G2', 'D3', 'F3'], 3], [['C3', 'G3', 'E4'], 3],
  [['C3', 'G3', 'E4'], 3], [['F2', 'C3', 'A3'], 3],
  [['C3', 'G3', 'E4'], 1.5], [['G2', 'D3', 'B3'], 1.5], [['C3', 'G3', 'E4'], 3],
];

const BEAT = 0.62; // seconds per beat

export default function BirthdayTune({ playing }: { playing: boolean }) {
  const partsRef = useRef<{ lead: Tone.Part; pad: Tone.Part } | null>(null);
  const disposeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => disposeRef.current?.();
  }, []);

  useEffect(() => {
    const setup = () => {
      if (partsRef.current) return partsRef.current;

      const reverb = new Tone.Reverb({ decay: 3.2, wet: 0.35 }).toDestination();
      const lead = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.4, sustain: 0.25, release: 1.4 },
        volume: -9,
      }).connect(reverb);
      const pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.3, decay: 0.8, sustain: 0.4, release: 2 },
        volume: -20,
      }).connect(reverb);

      let t = 0;
      const leadEvents = MELODY.map(([note, beats]) => {
        const ev = { time: t, note, dur: beats * BEAT * 0.9 };
        t += beats * BEAT;
        return ev;
      });
      const total = t + BEAT * 2; // small breath before looping

      let c = BEAT; // after the pickup
      const padEvents = CHORDS.map(([notes, beats]) => {
        const ev = { time: c, notes, dur: beats * BEAT };
        c += beats * BEAT;
        return ev;
      });

      const leadPart = new Tone.Part((time, ev) => {
        lead.triggerAttackRelease(ev.note, ev.dur, time);
      }, leadEvents);
      const padPart = new Tone.Part((time, ev) => {
        pad.triggerAttackRelease(ev.notes, ev.dur, time);
      }, padEvents);

      for (const p of [leadPart, padPart]) {
        p.loop = true;
        p.loopEnd = total;
      }

      partsRef.current = { lead: leadPart, pad: padPart };
      disposeRef.current = () => {
        leadPart.dispose();
        padPart.dispose();
        lead.dispose();
        pad.dispose();
        reverb.dispose();
        Tone.getTransport().stop();
        Tone.getTransport().cancel();
      };
      return partsRef.current;
    };

    const transport = Tone.getTransport();
    if (playing) {
      Tone.start().then(() => {
        if (!partsRef.current) {
          const parts = setup();
          parts.lead.start(0);
          parts.pad.start(0);
        }
        transport.start();
      });
    } else if (partsRef.current) {
      transport.pause();
    }
  }, [playing]);

  return null;
}
