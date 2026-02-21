const ftp = require("basic-ftp");
require("dotenv").config();

async function listFtp() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Root directory contents:");
        const rootList = await client.list();
        console.log(rootList.map(f => `${f.isDirectory ? '[DIR]' : '[FILE]'} ${f.name}`).join('\n'));

    } catch (err) {
        console.error("FTP List failed:", err);
    }
    client.close();
}

listFtp();
