import React from 'react'

export function Controller( { it }) {
    const [time, setTime] = React.useState(0);
    let timer = 5000;
    //TODO The controller must watch
    // - player list
    // - shot clock
    // who's it

    React.useEffect(() => {
        if (time <= 0) {
            console.log(it + " Has popped!");
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
        console.log("Time to pop: " + remaining);
        if (remaining > 0) requestRef.current = requestAnimationFrame(animate);
        else cancelAnimationFrame(requestRef.current);
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
}