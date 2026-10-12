const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\SAMA\\Desktop\\New folder';

const replacements = [
    { from: /الكورسات/g, to: 'المواد' },
    { from: /للكورسات/g, to: 'للمواد' },
    { from: /الكورس/g, to: 'المادة' },
    { from: /للكورس/g, to: 'للمادة' },
    { from: /كورسات/g, to: 'مواد' },
    { from: /كورس/g, to: 'مادة' },
    { from: /كورسك/g, to: 'مادتك' },
    // Also title replacements
    { from: /<title>Ù…Ø¬Ù…Ø¹ Ø·Ù„Ø§Ø¨ BIS</title>' }
];

function processDir(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'assets' && file !== 'css') {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            for (const { from, to } of replacements) {
                content = content.replace(from, to);
            }
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir(dir);
