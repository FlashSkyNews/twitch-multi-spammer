let WebSocket = require("ws");
 
class Spammer {
 
    constructor(username, oauthToken) {
        this.username = username;
        this.oauthToken = oauthToken;
 
        this.connectedChannels = [];
        this.twitchSocket = null;
        this.twitchSocketConnected = false;
 
        this._connectToTwitch();
    }
   
    _connectToTwitch() {
        this.twitchSocket = new WebSocket("wss://irc-ws.chat.twitch.tv/");
 
        this.twitchSocket.onopen = () => {
            this.twitchSocket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
            this.twitchSocket.send(`PASS oauth:${this.oauthToken}`);
            this.twitchSocket.send(`NICK ${this.username.toLowerCase()}`);
            this.twitchSocketConnected = true;
        };
 
        this.twitchSocket.onmessage = (message) => {
            if (message.data === "PING :tmi.twitch.tv\r\n") {
                this.twitchSocket.send("PONG :tmi.twitch.tv\r\n");
            }
        };
 
        this.twitchSocket.onerror = (err) => {
            console.log(err);
        };
    }
 
    joinChannel(channel) {
        channel = channel.toLowerCase();
        if (this.twitchSocketConnected) {
            this.twitchSocket.send(`JOIN #${channel}`);
            this.connectedChannels.push(channel);
        } else {
            let joinChannel = setInterval(() => {
                if (this.twitchSocketConnected === true) {
                    this.twitchSocket.send(`JOIN #${channel}`);
                    this.connectedChannels.push(channel);
                    clearInterval(joinChannel);
                }
            }, 20);
            return;
        }
    }
       
    writeMessage(channel, message) {
        channel = channel.toLowerCase();
        if (this.twitchSocketConnected && this.connectedChannels.includes(channel)) {
            this.twitchSocket.send(`PRIVMSG #${channel} :${message}`);
        } else if (this.connectedChannels.includes(channel)) {
            let writeMessage = setInterval(() => {
                if (this.twitchSocketConnected === true) {
                    this.twitchSocket.send(`PRIVMSG #${channel} :${message}`);
                    clearInterval(writeMessage);
                }
            }, 20);
            return;
        }
    }
 
}

module.exports = Spammer;