


[4:47 AM, 1/7/2026] my best  frend: const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const config = require('./config');

const { state, saveState } = useSingleFileAuthState('./session.json');

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ['MASTER MIND', 'Chrome', '1.0.0'],
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('Master Bot connected ✅');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const m = messages[0];
    if (!m.message) return;

    const from = m.key.remoteJid;
[4:47 AM, 1/7/2026] my best  frend: const msg = m.message.conversation || m.message.extendedTextMessage?.text || '';

    if (msg.startsWith('.menu')) {
      await sock.sendMessage(from, { text: '🔥 MASTER MIND MINI BOT MENU 🔥\n\n✅ .menu\n✅ .owner\n✅ .help\n\nPowered by Sahan Maduwantha' }, { quoted: m });
    }

    if (msg.startsWith('.owner')) {
      await sock.sendMessage(from, { text: 👑 Owner: wa.me/${config.owner[0]} }, { quoted: m });
    }
  });
}

startBot();