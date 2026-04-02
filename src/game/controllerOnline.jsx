import React from 'react'

export function ControllerOnline({ Receiver, it, setIt, setPopping, players, itClass, setItClass, gameOver, setGameOver, setWinner }) {
    // players will be a list of Player objects -> [{x:1, y:1, time:1000, skin:skin}, {}]
    const maxRound = 90000;
    const minRound = 30000;
    let timer = Math.floor(Math.random() * (maxRound - minRound)) + minRound;
    const [time, setTime] = React.useState(timer);
    const out = React.useRef(new Set());
    const [socket, setSocket] = React.useState(Receiver.socket);

    React.useEffect(() => {
        let end = false;
        if (time <= 0) {
            setPopping(it);
            out.current.add(it);
            // check if the game is over
            if (out.current.size == players.length - 1) {
                end = true;
                for (let i = 0; i < players.length; i++) {
                    if (!out.current.has(i)) setWinner(i);
                }
                setGameOver(end);
            }
            // if it's not, choose a new it and kick off a new timer
            if (!end) {
                let choice = it;
                while (out.current.has(choice)) choice = Math.floor(Math.random() * players.length);
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

    return (
        null
    );
}