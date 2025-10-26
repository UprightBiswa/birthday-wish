"use client";

import React, { useState, useEffect } from 'react';

type CountdownTimerProps = {
    targetDate: Date;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    useEffect(() => {
        if (!isClient) return;

        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();
            let newTimeLeft = {};

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return newTimeLeft;
        };
        
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, [isClient, targetDate]);

    const timerComponents: JSX.Element[] = [];

    Object.keys(timeLeft).forEach((interval) => {
        timerComponents.push(
            <div key={interval} className="flex flex-col items-center">
                <span className="text-5xl md:text-7xl font-bold text-primary-foreground drop-shadow-lg">
                    {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
                </span>
                <span className="text-lg md:text-xl text-accent uppercase tracking-widest">
                    {interval}
                </span>
            </div>
        );
    });

    return (
        <div className="z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-lg mb-2">
                Birthday Countdown
            </h2>
            <p className="text-xl text-accent mb-8">For Anisha's 9th Birthday!</p>
            <div className="flex justify-center gap-4 md:gap-8">
                {timerComponents.length ? timerComponents : <span>Loading...</span>}
            </div>
        </div>
    );
};

export default CountdownTimer;
