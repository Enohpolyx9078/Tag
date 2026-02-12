import React from 'react';

const formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    const hourStr = hours < 10 ? "0" + hours : hours;
    const minuteStr = minutes < 10 ? "0" + minutes : minutes;
    const secondStr = seconds < 10 ? "0" + seconds : seconds;
    return hourStr + ":" + minuteStr + ":" + secondStr;
}

export function Timer( { label }) {
    const [time, setTime] = React.useState(0);
    const requestRef = React.useRef();
    const startRef = React.useRef();

    // made with some help from Gemini 3
    const animate = async (now) => {
        if (!startRef.current) startRef.current = now;
        const deltaTime = now - startRef.current;
        setTime(Math.floor(deltaTime / 1000));
        requestRef.current = requestAnimationFrame(animate);
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return <p>{ label } {formatTime(time)}</p>
}