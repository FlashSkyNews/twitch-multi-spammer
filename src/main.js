import Spammer from "./spammer";
import { sleep } from "./helper";
import config from "../config.json";

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