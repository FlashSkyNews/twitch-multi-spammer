import Spammer from "./spammer";
import { sleep } from "./helper";
import config from "../config.json";

const spammer = new Spammer(config.username, config.oauth);
spammer.joinChannel(config.username);

(async() => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        spammer.writeMessage(config.targetChannel, config.message);
        await sleep(1000);
    }
})();