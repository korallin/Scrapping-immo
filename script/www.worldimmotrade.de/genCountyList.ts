let data = Deno.readTextFileSync('./list_pays.html');

//get only the country code
let countryCodes = []

//match from href="/search/DE
let regex = /href="\/search\/([A-Z]{2})/g;
//get all county codes
let match;
while ((match = regex.exec(data)) !== null) {
    countryCodes.push(match[1]);
}

console.log(countryCodes);

let str = ""
for (let i = 0; i < countryCodes.length; i++) {
    str += countryCodes[i] + "\n";
}
Deno.writeTextFileSync("./countryCodeList.txt", str);