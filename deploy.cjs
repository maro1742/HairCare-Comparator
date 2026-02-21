const ftp = require("basic-ftp");
const path = require("path");
require("dotenv").config();

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        console.log("Connecting to FTP...");
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        console.log("Connected to FTP");

        // Navigate to public_html
        await client.ensureDir("public_html");

        // Let's not completely wipe the dir in case of other files, but basic-ftp clearWorkingDir is fine usually.
        // Dhosting might have some other hidden files we shouldn't touch, like .htaccess. 
        // Actually, basic-ftp's uploadFromDir will overwrite existing files. This is safer than wiping.

        console.log("Uploading dist/ folder to public_html/...");
        await client.uploadFromDir(path.join(__dirname, "dist"));

        console.log("Deployment successful!");
    } catch (err) {
        console.error("Deployment failed:", err);
    }
    client.close();
}

deploy();
