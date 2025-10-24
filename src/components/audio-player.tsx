"use client";

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

type AudioPlayerProps = {
    isPlaying: boolean;
};

export default function AudioPlayer({ isPlaying }: AudioPlayerProps) {
    const seqRef = useRef<Tone.Sequence | null>(null);
    const synthRef = useRef<Tone.Synth | null>(null);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        const synth = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.005,
                decay: 0.1,
                sustain: 0.3,
                release: 1
            }
        }).toDestination();
        synthRef.current = synth;

        const melody = [
            'G4', 'G4', 'A4', 'G4', 'C5', 'B4',
            'G4', 'G4', 'A4', 'G4', 'D5', 'C5',
            'G4', 'G4', 'G5', 'E5', 'C5', 'B4', 'A4',
            'F5', 'F5', 'E5', 'C5', 'D5', 'C5'
        ];
        
        const seq = new Tone.Sequence((time, note) => {
            synth.triggerAttackRelease(note, '8n', time);
        }, melody, '4n');
        
        seq.loop = true;
        seqRef.current = seq;

        return () => {
            seq.stop();
            seq.dispose();
            synth.dispose();
            if (Tone.Transport.state === 'started') {
              Tone.Transport.stop();
              Tone.Transport.cancel();
            }
        };
    }, []);

    useEffect(() => {
        const startAudio = async () => {
            if (!hasStartedRef.current) {
                await Tone.start();
                hasStartedRef.current = true;
            }
            if (Tone.Transport.state !== 'started') {
                 Tone.Transport.start();
            }
            if(seqRef.current) {
                seqRef.current.start(0);
            }
        };

        const stopAudio = () => {
             if (seqRef.current) {
                seqRef.current.stop();
            }
        };

        if (isPlaying) {
            startAudio();
        } else {
            stopAudio();
        }

    }, [isPlaying]);

    return null;
}
