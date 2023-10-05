const EventEmitter = require('events');
const fs = require('fs').promises;

const log = async (message) => {
    try {

    } catch (err) {
        if (err) console.error(err);
    }
    await fs.appendFile('../logs/requestLogs', message)
}

module.exports = ;