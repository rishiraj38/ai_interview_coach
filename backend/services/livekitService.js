const { AccessToken } = require('livekit-server-sdk');

const createToken = async (participantName, roomName) => {
    // If this room doesn't exist, it'll be automatically created when the first
    // client joins
    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: participantName,
            // Token to expire after 1 hour
            ttl: '1h',
        },
    );

    at.addGrant({ roomJoin: true, room: roomName });

    return await at.toJwt();
};

module.exports = {
    createToken,
};
