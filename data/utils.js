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

const generateId = (recipeName, ids) => {
    return new Promise((resolve, reject) => {
        let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_ -:;,.$";
        let id = 1;
        console.log(recipeName)
        for (let i = 0; i < recipeName.length; i++) {
            const element = recipeName[i];
            let number = alphabet.indexOf(element)+1 || 1;
            id *= number; 
        }
        console.log("ids", ids)
        console.log("id", id)
        while (ids.includes(id)) {
            id += 1;
        }
        resolve(id);
    })
        
    
}


module.exports = { readJson, generateId };
