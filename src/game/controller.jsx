import React from 'react'

export function Controller({ it, setIt, setPopping, players, size }) {
    // players will be a list of Player objects -> [{x:1, y:1, time:1000, skin:skin}, {}]

    const maxRound = 30000;
    const minRound = 10000
    const canTag = React.useRef(true);
    let timer = Math.floor(Math.random() * (maxRound - minRound)) + minRound;
    const [time, setTime] = React.useState(timer);
    const out = React.useRef([]);

    React.useEffect(() => {
        if (time <= 0) {
            setPopping(it);
            out.current.push(it);
        }
    }, [time]);

    const checkCollisions = async () => {
        for (let i = 0; i < players.length - 1; i++) {
            if (out.current.indexOf(i) != -1) continue;
            let p1Position = players[i];
            for (let j = i + 1; j < players.length; j++) {
                if (out.current.indexOf(j) != -1) continue;
                let p2Position = players[j];
                // check if x overlaps
                let leftEdge = Math.max(p1Position.x, p2Position.x);
                let rightEdge = Math.min(p1Position.x + size, p2Position.x + size);
                let xOverlap = rightEdge - leftEdge >= 0;
                // check if y overlaps
                let topEdge = Math.max(p1Position.y, p2Position.y);
                let bottomEdge = Math.min(p1Position.y + size, p2Position.y + size);
                let yOverlap = bottomEdge - topEdge >= 0;
                // if both overlap, they collided
                if (xOverlap && yOverlap && canTag.current) {
                    //TODO allow more than two players
                    if (it == 0) setIt(1);
                    else setIt(0);
                    canTag.current = false;
                    itCooldown();
                }
            }
        }
    }

    const itCooldown = async () => {
        canTag.current = false;
        setTimeout(() => canTag.current = true, 500);
    }

    React.useEffect(() => checkCollisions, [...players]);

    return (
        <ShotClock timer={timer} setTime={setTime} />
    );
}

export function ShotClock({ timer, setTime }) {
    const requestRef = React.useRef();
    const startTime = React.useRef();

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