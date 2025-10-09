
let ioInstance = null;
let activeUsersMap = new Map();

const setSocketIo = (io) => {
    ioInstance = io;
};

const getSocketIo = () => {
    if (!ioInstance) {
        throw new Error('Socket.IO has not been initialized.');
    }
    return ioInstance;
};


const setActiveUsers = (usersMap) => {
    activeUsersMap = usersMap;
};

const getActiveUsers = () => {
    return activeUsersMap;
};

module.exports = {
    setSocketIo,
    getSocketIo,
    setActiveUsers,
    getActiveUsers
};