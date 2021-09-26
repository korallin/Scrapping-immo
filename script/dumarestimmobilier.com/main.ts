async function Execute(commande: any) {
  var content = "";
  var comcmd = commande.split(' ')
  var p = Deno.run({
    cmd: comcmd,
    stdout: "piped"
  });

  var { code } = await p.status();
  if (code === 0) {
    var rawOutput = await p.output();
    content = new TextDecoder().decode(rawOutput);
  }
  return content
}

let all = []

for (let i = 1; i <= 5; i++) {
  console.log(`https://www.dumarestimmobilier.com/vente?page=${i}`)
  let page0 = await fetch(`https://www.dumarestimmobilier.com/vente?page=${i}`)
  let page = await page0.text()

  let array = page.split('<script type="application/ld+json">')
  for (let j = 1; j < array.length; j++) {
    let newA = array[j].split('</script>')[0]
    all.push(newA)
  }
}

Deno.writeTextFileSync("./index.json", '[' + JSON.parse(JSON.stringify(all)) + ']')