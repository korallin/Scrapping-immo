let config = JSON.parse(Deno.readTextFileSync("database.json"));
let count = 0;
let isEnd = false;


let maxStop = 100000
if(Deno.args[0] != undefined){
    if(Deno.args[0] == "--max"){
        maxStop = Number(Deno.args[1])
    }
}

console.log("Max Stop: " + maxStop)

let newConf = config

async function getData(){
    newConf = config

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://376d471aeaa6453ca45446810aebe6e5.eu-west-3.aws.elastic-cloud.com:9243/property/_search",
        "method": "POST",
        "headers": {
          "accept": "application/json, text/plain, */*",
          "authorization": "Basic cHVibGljOjcwNDJOZG1XRmtxVmo3YWJUNTR3MGpuWQ==",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
          "origin": "https://www.leggett-immo.com",
          "content-type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(newConf)
      };

    let data = await fetch("https://376d471aeaa6453ca45446810aebe6e5.eu-west-3.aws.elastic-cloud.com:9243/property/_search",settings)
    let houses = await data.json();

    try{
        if(houses.hits.hits.length == 0 || count >= maxStop){
            isEnd = true
        } else {
            console.log('---------------------')
            for(let i = 0; i < houses.hits.hits.length; i++){
                console.log(houses.hits.hits[i]._id)
                Deno.writeTextFileSync(`./data/${houses.hits.hits[i]._id}.json`, JSON.stringify(houses.hits.hits[i]))
                count++
            }
            console.log("Size: "+count)
        }
    } catch(e){
        isEnd = true
        console.log(e)
    }

    if(!isEnd){
        await getData()
    }
}

await getData()

console.log("END: ")
console.log(count)
