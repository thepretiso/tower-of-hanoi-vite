const formatValueXX = (value: number) => {
    return value < 10 ? `0${value}` : `${value}`;
};

export const formatMilisecondsHHMMSS = (miliseconds: number) => {
    const seconds = Math.floor((miliseconds / 1000) % 60);
    const minutes = Math.floor((miliseconds / 1000 / 60) % 60);
    const hours = Math.floor((miliseconds  / 1000 / 3600 ) % 24)
    return [
        formatValueXX(hours),
        formatValueXX(minutes),
        formatValueXX(seconds),
    ].join(':');
};
