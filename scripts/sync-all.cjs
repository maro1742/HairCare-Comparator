const { execSync } = require('child_process');
const path = require('path');

const scripts = [
    'sync-ceneo.cjs',
    'sync-dsd-deluxe.cjs',
    'sync-insight.cjs',
    'sync-natura.cjs',
    'sync-webepartners.cjs'
];

console.log('Starting Master Sync...');

scripts.forEach(script => {
    console.log(`\n--- Running ${script} ---`);
    try {
        const scriptPath = path.join(__dirname, script);
        const output = execSync(`node "${scriptPath}"`, { encoding: 'utf-8' });
        console.log(output);
    } catch (error) {
        console.error(`Error running ${script}:`, error.message);
        if (error.stdout) console.log('Stdout:', error.stdout);
        if (error.stderr) console.error('Stderr:', error.stderr);
    }
});

console.log('\nMaster Sync Completed.');
