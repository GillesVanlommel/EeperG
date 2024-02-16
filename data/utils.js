const { rejects } = require('assert');
const { json } = require('express');
const fs = require('fs');

const readJson = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                reject(err);
            }
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            }
            catch (error) {
                console.error("Error parsing JSON:", error);
                reject(error);
            }
        });
    });
}

module.exports = { readJson };