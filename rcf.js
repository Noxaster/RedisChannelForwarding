const Redis = require('ioredis');

const redisSub = new Redis({
    host: '',
    port: 6379,
    password: ''
});

const redisPub = new Redis({
    host: '',
    port: 6379,
    password: ''
});

const sourceChannel = 'channel1';
const targetChannel = 'channel2';
const targetServer = ['server1','server2','server3'];

redisSub.subscribe(sourceChannel, () => {
    console.log(`Sub: ${sourceChannel}`);
});

redisSub.on('message', (channel, message) => {
    try {
        const parsed = JSON.parse(message);
        const fromUUID = parsed.senderId || "";
        const messageJson = parsed.message ? JSON.parse(parsed.message) : null;

        let username = "";
        let chatText = "";

        if (messageJson && Array.isArray(messageJson.extra)) {
            const extras = messageJson.extra;

            for (const part of extras) {
                if (typeof part === "object" && part.color === "yellow" && part.text) {
                    username = part.text;
                }
            }

            const indexOfArrow = extras.findIndex(part =>
                typeof part === "object" && part.text && part.text.includes(">>>")
            );

            if (indexOfArrow !== -1 && extras.length > indexOfArrow + 1) {
                const afterArrow = extras.slice(indexOfArrow + 1);

                for (const part of afterArrow) {
                    if (typeof part === "string") {
                        chatText += part;
                    } else if (typeof part === "object" && part.text) {
                        chatText += part.text;
                    }
                }
            }
        }

        for(const mcserver of targetServer){
            const msg = {
                type: "PUBLIC_MESSAGE",
                toPlayerName: "",
                message: JSON.stringify({
                    extra: [
                        {
                            hoverEvent: {
                                action: "show_text",
                                value: [
                                    {
                                        extra: [{ text: "Messages from Other Server" }],
                                        text: ""
                                    }
                                ]
                            },
                            extra: [
                                {
                                    extra: [{ text: "§r" }],
                                    text: ""
                                }
                            ],
                            text: ""
                        },
                        {
                            extra: [
                                {
                                    clickEvent: {
                                        action: "suggest_command",
                                        value: "/server server3"
                                    },
                                    hoverEvent: {
                                        action: "show_text",
                                        value: [
                                            {
                                                extra: [{ text: "Server: server3" }],
                                                text: ""
                                            }
                                        ]
                                    },
                                    extra: [
                                        {
                                            extra: [{ text: "§b[3]" }],
                                            text: ""
                                        }
                                    ],
                                    text: ""
                                }
                            ],
                            text: ""
                        },
                        {
                            clickEvent: {
                                action: "suggest_command",
                                value: `/msg ${username}`
                            },
                            hoverEvent: {
                                action: "show_text",
                                value: [
                                    {
                                        extra: [{ text: "Click to PM" }],
                                        text: ""
                                    }
                                ]
                            },
                            extra: [
                                {
                                    extra: [{ text: `§e${username}` }],
                                    text: ""
                                }
                            ],
                            text: ""
                        },
                        {
                            extra: [
                                {
                                    extra: [{ text: " §7>>> " }],
                                    text: ""
                                }
                            ],
                            text: ""
                        },
                        {
                            extra: [
                                {
                                    extra: [{ text: "§r" }],
                                    text: ""
                                },
                                {
                                    extra: [{ text: chatText }],
                                    text: ""
                                },
                                { text: "" }
                            ],
                            text: ""
                        }
                    ],
                    text: ""
                }),
                fromServer: "server3",
                fromPlayerUUID: fromUUID,
                toServer: "",
                toMCServer: mcserver,
                playerList: []
            };

            redisPub.publish(targetChannel, JSON.stringify(msg)).then(() => {
                // console.log(`Forward OK ${targetChannel}: ${username} >>> ${chatText}`);
            });
        }

    } catch (err) {
        console.error("Forward Error: ", err.message);
    }
});
