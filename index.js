const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const DEFAULT_CHANNEL_ID = '1568293452393873500';

function connectToVoice(channel) {
    try {
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        console.log(`[حراسة أسطورية] البوت ثبت في الروم: ${channel.name}`);
    } catch (error) {
        console.error('خطأ أثناء الاتصال بالروم:', error);
    }
}

client.once('ready', async () => {
    console.log(`[أسطوري] بوت Astro Family اشتغل: ${client.user.tag}`);
    client.user.setActivity({
        name: 'Astro Family 24/7 Guard',
        type: ActivityType.Streaming,
        url: 'https://www.twitch.tv/discord'
    });

    try {
        const channel = await client.channels.fetch(DEFAULT_CHANNEL_ID);
        if (channel && channel.isVoiceBased()) {
            connectToVoice(channel);
        }
    } catch (error) {
        console.error('خطأ في جلب الروم الافتراضي:', error);
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.content === '!join') {
        if (!message.member.voice.channel) return message.reply('يا أسترو، ادخل روم صوتي أول عشان أجيك!');
        connectToVoice(message.member.voice.channel);
        message.reply(`تم! جيت معك لروم: **${message.member.voice.channel.name}**`);
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id) {
        if (oldState.channelId && !newState.channelId) {
            setTimeout(async () => {
                try {
                    const defaultChannel = await client.channels.fetch(DEFAULT_CHANNEL_ID);
                    if (defaultChannel) connectToVoice(defaultChannel);
                } catch (err) {}
            }, 1000);
        }
    }
});

client.login("MTU2OTA3OTUxMjI1NDM4MjIxMQ.GF969E.iRgdlo2w87g-VcaVpukV28U4GWdlipnFphKuQc");
