const crypto = require("crypto");


async function encryptText(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = '';
    encrypted += cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + encrypted;
}

async function decryptText(encryptedText, key) {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = '';
    decrypted += decipher.update(encryptedText.slice(32), 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {
    encryptText,
    decryptText
}