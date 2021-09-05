//get the total number of pages

let ALL_Link_Array = []
try{ALL_Link_Array = JSON.parse(Deno.readTextFileSync('./immobilier.hu.link.json'))} catch(err){}

const debug = false

let data = await fetch("https://immobilier.hu/recherche?location_ids=&type=&sell_type=&price%5Bmin%5D=&price%5Bmax%5D=&page=2&per-page=12")
let data2 = await data.text()
let pageData = data2.split('<form class="form-horizontal"')[1].split('</form>')[0].split('<strong>')[1].split('</strong>')[0]
let MaxPage = parseInt(pageData) / 12

console.log(`Analyse max page: ${MaxPage} with ${pageData} total products`)

async function getData(page) {
    let tmpData = page.split('<div class="col-sm-4')
    for(let i = 1; i < tmpData.length; i++) {
        let link = "https://immobilier.hu"+tmpData[i].split('<a href="')[1].split('"')[0]
        if(ALL_Link_Array.indexOf(link) == -1){
            ALL_Link_Array.push(link)
        }
    }
}

async function backUpTheData() {
    Deno.writeTextFileSync("./immobilier.hu.link.json", JSON.stringify(ALL_Link_Array))
}

if(Deno.args.indexOf("--skip-scan") == -1) {
    for(let i = 1; i <= MaxPage; i++) {
        console.log(`Analyse page - ${i}`)
        let page = await fetch(`https://immobilier.hu/recherche?location_ids=&type=&sell_type=&price%5Bmin%5D=&price%5Bmax%5D=&page=${i}&per-page=12`)
        let pageText = await page.text()
        let pageData = pageText.split('<div class="Apartment-Collection row">')[1].split('<style>')[0]
        await getData(pageData)
        await backUpTheData()
    }
    //Full backup
    Deno.writeTextFileSync("./immobilier.hu.full.json", JSON.stringify(ALL_Link_Array))
} else {
    console.log(`Skiping scan, got ${ALL_Link_Array.length} url of house`)
}

// Get The Houses data

async function getAppPage(page) {
    return page.split('<div class="ApartmentPage">')[1].split('section-footer')[0]
}

async function getHouseInfo(page, link) {
    page = await getAppPage(page)
    let house = {
        title: "",
        price: "",
        dev: {appartID: 0,link: link},
        descriptif: {origin: "",fr: ""},
        infos: {surface: "",terrin: "",etat: "",type: "",matConstruction: "",typeChauffage: "",lvlConfort: "",age: "",situation: "", nbEtage: ""},
        pic: []
    }

    try { house.title = page.split('<h1 class="ApartmentPage__Title">')[1].split('</h1>')[0] } catch(err) {}
    try { house.price = page.split('<span class="ApartmentPage__Price--eur">')[1].split('</span>')[0] } catch(err) {}
    
    try { house.dev.appartID = page.split('data-apartment-id="')[1].split('"')[0] } catch(err) {}
    try { house.descriptif.origin = pretty(page.split('<strong>Texte originel</strong><br>')[1].split('</p>')[0].replace(/\n/g, '').replace(/  /g, '')) } catch(err) {}
    try { house.descriptif.fr = pretty(page.split('<strong>Texte traduit</strong><br>')[1].split('</p>')[0]) } catch(err) {}
    
    try { house.infos.surface = pretty(page.split('<label>Dimension des territoires</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}
    try { house.infos.terrin = pretty(page.split('<label>Dimension de terrain</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}
    try { house.infos.etat = pretty(page.split('<label>État de bien</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}
    try { house.infos.type = pretty(page.split('<label>Type</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}
    try { house.infos.matConstruction = pretty(page.split('<label>Matériau de construction</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}
    try { house.infos.typeChauffage = pretty(page.split('<label>Type de chauffage</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}
    try { house.infos.lvlConfort = pretty(page.split('<label>Niveau confort</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}
    try { house.infos.age = pretty(page.split('<label>Âge</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}
    try { house.infos.situation = pretty(page.split('<label>Situation</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}
    try { house.infos.nbEtage = pretty(page.split('<label>Étage</label>')[1].split('<p>')[1].split('</p>')[0]) } catch(err) {}

    Deno.writeTextFileSync(`./data/${house.dev.appartID}.json`, JSON.stringify(house))
}


async function getPic(page) {
    let pic = []
    let tmpPic = page.split('<div class="row ApartmentImage__list">')[1].split('<div class="col-lg-6 col-md-6 col-sm-6">')
    for(let i = 1; i < tmpPic.length; i++) {
        pic.push(tmpPic[i].split('src="')[1].split('"')[0])
    }
    return pic
}

function pretty(data) {
    let out = data.replace(/\n/g, '').replace(/  /g, '')
    while(out.startsWith(' ')) {
        out = out.replace(' ', '')
    }
    return out
}

for(let i=0; i<ALL_Link_Array.length; i++) {
    console.log(`Analyse house to get data - ${ALL_Link_Array[i]}`)
    let page = await fetch(ALL_Link_Array[i])
    let pageText = await page.text()
    await getHouseInfo(pageText, ALL_Link_Array[i])
    ALL_Link_Array = ALL_Link_Array.slice(1)
    await backUpTheData()
}
