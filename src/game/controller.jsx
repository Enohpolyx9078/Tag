import React from 'react'

export function Controller({ it, setIt, setPopping, players, size, itClass, setItClass, gameOver, setGameOver, setWinner }) {
    // players will be a list of Player objects -> [{x:1, y:1, time:1000, skin:skin}, {}]
    const maxRound = 90000;
    const minRound = 30000;
    const canTag = React.useRef(true);
    let timer = Math.floor(Math.random() * (maxRound - minRound)) + minRound;
    const [time, setTime] = React.useState(timer);
    const out = React.useRef(new Set());

    React.useEffect(() => {
        let end = false;
        if (time <= 0) {
            console.log("Time: " + time);
            setPopping(it);
            out.current.add(it);
            // check if the game is over
            if (out.current.size == players.length - 1) {
                end = true;
                setGameOver(end);
                for (let i = 0; i < players.length; i++) {
                    if (!out.current.has(i)) setWinner(i);
                }
            }
            // if it's not, choose a new it and kick off a new timer
            if (!end) {
                let choice = it;
                while (out.current.has(choice)) choice = Math.floor(Math.random() * 4);
                setIt(choice);
                setItClass("it");
            }
        }
        switch (itClass) {
            case "it":
                if (time <= timer / 2) setItClass("it-halfway");
                break;
            case "it-halfway":
                if (time <= timer / 4) setItClass("it-soon");
                break;
            case "it-soon":
                if (time <= timer / 10) setItClass("it-very-soon");
                break;
        }
    }, [time]);

    const checkCollisions = async () => {
        for (let i = 0; i < players.length - 1; i++) {
            if (out.current.has(i)) continue;
            let p1Position = players[i];
            for (let j = i + 1; j < players.length; j++) {
                if (out.current.has(j)) continue;
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
                    if (it == j) setIt(i);
                    else if (it == i) setIt(j);
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
        gameOver ? null : <ShotClock timer={timer} setTime={setTime} />
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
        else {
            console.log("Continuing");
            startTime.current = now;
            requestRef.current = requestAnimationFrame(animate);
        }
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
}