import Spammer from "./spammer";
import { sleep } from "./helper";
import config from "../config.json";

(async() => {
    const spammer = new Spammer(config.username, config.oauth);
    spammer.joinChannel(config.username);

    // eslint-disable-next-line no-constant-condition
    while (true) {
        spammer.writeMessage(config.targetChannel, config.message);
        await sleep(config.timeToSleep);
    }
})();

