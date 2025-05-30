import crypto from 'crypto';

export function encrypt (chatKey: Buffer) {
    try {
        const server_key = Buffer.from(process.env.SERVER_KEY, 'base64');
        const server_iv = Buffer.from(process.env.SERVER_IV, 'base64')
        const cipher = crypto.createCipheriv('aes-256-cbc', server_key, server_iv);

        const encrypted = Buffer.concat([cipher.update(chatKey), cipher.final()]);
        
        return encrypted;
    } catch (error) {
        console.log(error);
    }
}

export function decrypt (chatKey: Buffer) {
    try {
        const server_key = Buffer.from(process.env.SERVER_KEY, 'base64');
        const server_iv = Buffer.from(process.env.SERVER_IV, 'base64')
        const decipher = crypto.createDecipheriv('aes-256-cbc', server_key, server_iv);

        const decrypted = Buffer.concat([decipher.update(chatKey), decipher.final()]);
        
        return decrypted;
    } catch (error) {
        console.log(error);
    }
}