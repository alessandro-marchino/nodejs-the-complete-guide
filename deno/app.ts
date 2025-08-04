const text = 'This is a test - and it should be stored in a file!';

const textEncoder = new TextEncoder();
const data = textEncoder.encode(text);

await Deno.writeFile('message.txt', data);
console.log('Wrote to file');
