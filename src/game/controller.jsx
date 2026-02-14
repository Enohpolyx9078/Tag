import React from 'react'

export function Controller( { it, setPopping }) {
    let timer = 5000;
    const [time, setTime] = React.useState(timer);
    const out = [];

    React.useEffect(() => {
        if (time <= 0) {
            setPopping(it);
            out.push(it);
        }
    }, [time]);

    return (
        <ShotClock timer={ timer } setTime={ setTime } />
    );
}

export function ShotClock({ timer, setTime }) {
    const requestRef = React.useRef();
    const startTime = React.useRef();

    // made with some help from Gemini 3
    const animate = async (now) => {
        if (!startTime.current) startTime.current = now;
        const deltaTime = now - startTime.current;
        const remaining = timer - deltaTime;
        setTime(remaining);
        if (remaining > 0) requestRef.current = requestAnimationFrame(animate);
        else cancelAnimationFrame(requestRef.current);
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
}