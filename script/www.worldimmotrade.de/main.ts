let country = Deno.readTextFileSync("./countryCodeList.txt").split('\n')

let content = []

//get all data
for(let i = 0; i < country.length; i++) {
    console.log("Fetch "+country[i])
    let breaker = false;
    let counter = 1;
    let tmp = {
        country: country[i],
        estate: []
    }
    while(!breaker) {
        console.log("Fetch "+country[i]+" page "+counter)
        let url = `https://www.worldimmotrade.de/api/estate/search?page=${counter}&currency=eur&geoData.countryCode=${country[i]}&topOffersSeparately=true`
    
        let res = await fetch(url);
        let data = await res.json();
        if(data.values.length === 0) {
            breaker = true;
        } else {
            for(let j = 0; j < data.values.length; j++) {
                tmp.estate.push(data.values[j])
            }
        }
        counter++
    }
    content.push(tmp)
}

Deno.writeTextFileSync('data.json', JSON.stringify(content))



   
