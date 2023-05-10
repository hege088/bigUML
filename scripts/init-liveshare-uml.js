const os = require('os');
const fs = require('fs');

const publisher = 'BIGModelingTools';

const liveshareConfigFileName = '.vs-liveshare-settings.json';
const homedir = os.homedir() + '/';
const liveshareConfigPath = homedir + liveshareConfigFileName;
const publisherKey = publisher + '.*';

function showError(err) {
    console.error(err);

    console.log('Writing liveshare config was not possible. Please do on your own. Create a file with filename "' + liveshareConfigFileName + '" in your home directory (' + homedir + '). And add following content:');
    console.log({
        extensionPermissions: {
            [publisherKey]: '*'
        }
    });
}

const fileNotFoundCode = 'ENOENT';

try {
    let data = null;
    try {
        data = fs.readFileSync(liveshareConfigPath, 'utf-8');
    } catch (readErr) {
        if (readErr.code !== fileNotFoundCode) {
            throw readErr;
        }
    }

    const jsonData = data == null ? {} : JSON.parse(data);

    if (!jsonData.extensionPermissions) {
        jsonData.extensionPermissions = {};
    }

    jsonData.extensionPermissions[publisherKey] = '*';

    fs.writeFileSync(liveshareConfigPath, JSON.stringify(jsonData));

    console.log('File: ' + liveshareConfigPath);
    console.log('Content:');
    console.log(jsonData);
} catch(err) {
    showError(err);
}


