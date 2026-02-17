import React from 'react';

function formatTime(timeStamp) {
    let seconds = Math.floor(timeStamp / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    const hourStr = hours < 10 ? "0" + hours : hours;
    const minuteStr = minutes < 10 ? "0" + minutes : minutes;
    const secondStr = seconds < 10 ? "0" + seconds : seconds;
    return hourStr + ":" + minuteStr + ":" + secondStr;
}

export function Timer({ you, label, it, id, gameOver }) {
    const [time, setTime] = React.useState(0);
    const requestRef = React.useRef();
    const lastTime = React.useRef();
    const type = label.indexOf('not') == -1 ? 'it' : 'not';
    const [active, setActive] = React.useState((type == 'it'));

    // made with some help from Gemini 3
    const animate = async (now) => {
        if (lastTime.current != undefined) {
            const deltaTime = now - lastTime.current;
            setTime(prev => prev + deltaTime);
        }
        lastTime.current = now;
        requestRef.current = requestAnimationFrame(animate);
    }

    React.useEffect(() => {
        if (active) requestRef.current = requestAnimationFrame(animate);
        else {
            cancelAnimationFrame(requestRef.current);
            lastTime.current = undefined;
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [active]);

    React.useEffect(() => {
        if (type == 'it') {
            if (it == id) setActive(true);
            else setActive(false);
        } else {
            if (it != id) setActive(true);
            else setActive(false);
        }
    }, [it]);

    //TODO stop timer when the attached player dies

    React.useEffect(() => {
        if (gameOver) {
            setActive(false);
            // only save player1's stats
            if (id == you.current) {
                let times = localStorage.getItem("times");
                times = times == null ? { it: 0, notIt: 0, wins: 0 } : JSON.parse(times);
                if (type == 'it') times.it += time;
                else times.notIt += time;
                localStorage.setItem("times", JSON.stringify(times));
            }
        }
    }, [gameOver]);

    return <p>{label} {formatTime(time)}</p>
}