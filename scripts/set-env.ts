// scripts/set-env.ts
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../src/environments/environment.prod.ts');

const fileContent = `
export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env['apiKey'] ?? ''}',
    authDomain: '${process.env['authDomain'] ?? ''}',
    projectId: '${process.env['projectId'] ?? ''}',
    storageBucket: '${process.env['storageBucket'] ?? ''}',
    messagingSenderId: '${process.env['messagingSenderId'] ?? ''}',
    appId: '${process.env['appId'] ?? ''}',
    measurementId: '${process.env['measurementId'] ?? ''}',
  }
};
`;

fs.writeFileSync(envPath, fileContent);
console.log('environment.ts generated successfully');