import { useState, useEffect } from 'react';

export function useLiveKitAuth(roomName: string, participantName: string) {
    const [token, setToken] = useState<string>("");
    const [url, setUrl] = useState<string>(process.env.NEXT_PUBLIC_LIVEKIT_URL || "");

    useEffect(() => {
        if (!roomName || !participantName) return;

        (async () => {
            try {
                const resp = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/livekit/token?room=${roomName}&username=${participantName}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [roomName, participantName]);

    return { token, url };
}
