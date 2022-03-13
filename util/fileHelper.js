const fs = require('fs');

exports.fileDelete = (filepath) => {
    fs.unlink(filepath, (err) => {
        if (err) throw err;
    })
}