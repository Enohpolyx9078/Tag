import React from 'react'

export function ControllerOnline({ Receiver, itClass, setItClass }) {
    const [socket, setSocket] = React.useState(Receiver.socket);

    // React.useEffect(() => {
    //     switch (itClass) {
    //         case "it":
    //             if (time <= timer / 2) setItClass("it-halfway");
    //             break;
    //         case "it-halfway":
    //             if (time <= timer / 4) setItClass("it-soon");
    //             break;
    //         case "it-soon":
    //             if (time <= timer / 10) setItClass("it-very-soon");
    //             break;
    //     }
    // }, [time]);

    return null;
}