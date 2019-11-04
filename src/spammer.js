import axios from "axios";
import WebSocket from "ws";

export default class Spammer {
    /**
     * 
     * @param {object} oauthToken
     * @param {number} sleepInterval
     */
    constructor(username, oauthToken) {
        this.username = username;
        this.oauthToken = oauthToken;

        this.twitchSocket = null;
        this.twitchSocketConnected = false;
    }

    /**
     * @returns {object} OAuth response
     */
    static GetAccount() {
        return axios({
            method: "GET",
            url: "https://id.twitch.tv/oauth2/validate",
            headers: {
                "Authorization": `OAuth ${this.oauth_token}`,
            }
        }).then(response => {
            return response.data;
        });
    }

    _connectToTwitch() {
        this.twitchSocket = new WebSocket("wss://irc-ws.chat.twitch.tv/");

        this.twitchSocket.onopen = () => {
            this.twitchSocket.send(`PASS oauth:${this.oauth}`);
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

    /**
     * 
     * @param {string} channel 
     */
    joinChannel(channel) {
        channel = channel.toLowerCase();
        if (this.twitchSocketConnected) {
            this.twitchSocket.send(`JOIN #${channel}`);
        } else {
            let joinChannel = setInterval(() => {
                if (this.twitchSocketConnected === true) {
                    this.twitchSocket.send(`JOIN #${channel}`);
                    clearInterval(joinChannel);
                }
            }, 20);
            return;
        }
    }
    
    /**
     * 
     * @param {string} channel 
     * @param {string} message 
     */
    writeMessage(channel, message) {
        channel = channel.toLowerCase();
        this.twitchSocket.send(`PRIVMSG #${channel} :${message}`);
    }
}
