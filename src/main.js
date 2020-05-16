let Spammer = require("./spammer.js");
let { sleep } = require("./helper.js");
let config = require("../config.json.js");

let spammers = [];
for (const account of config.accounts) {
    const spammer = new Spammer(account.username, account.oauth);
    spammer.joinChannel(config.targetChannel);
    spammers.push(spammer);
}

(async() => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        for (const spammer of spammers) {
            spammer.writeMessage(config.targetChannel, config.message);
        }
        await sleep(config.timeToSleep);
    }
})();