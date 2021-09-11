# Scrapping-immo

with Deno

# Supported Website: 

| Name | URL | Last maj | Type |
| :---- | :---- | :---- | :---- |
| Immobilier.hu | [Link](https://immobilier.hu/) | 05/09/2021 | Scrapping pur |
| Leggett-immo | [Link](https://www.leggett-immo.com) | 11/09/2021 | Exploit weak API |


# Launch 

## Immobilier.hu

`deno run -A --unstable --no-check scrapp.ts [--skip-scan]`

- `--skip-scan`:saute le scan du site et tope direct les maison


## Leggett-immo

### Deno (instable)
`deno run -A --unstable --no-check main.ts [--max NUMBER]`

- `--max`: max de donné a scrapp: `NUMBER`
    - `deno run -A --unstable --no-check main.ts --max 100`

### Firecamp manual

URL: `https://376d471aeaa6453ca45446810aebe6e5.eu-west-3.aws.elastic-cloud.com:9243/property/_search`

Header: 
```
Accept: application/json, text/plain, */*
Authorization: Basic cHVibGljOjcwNDJOZG1XRmtxVmo3YWJUNTR3MGpuWQ==
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36
Origin: https://www.leggett-immo.com
Content-Type: application/json
```

Body JSON: 
```JSON
{"aggs":{"areas":{"filter":{"match_all":{}},"aggs":{"region_name_fr.keyword":{"filter":{"match_all":{}},"aggs":{"region_name_fr.keyword":{"terms":{"field":"region_name_fr.keyword","size":200}}}}}},"metascore":{"filter":{"match_all":{}},"aggs":{"metascore":{"stats":{"field":"metaScore"}}}},"price5":{"filter":{"match_all":{}},"aggs":{"price":{"range":{"field":"price","ranges":[{"key":"Tout"},{"key":"< 50k","from":0,"to":50000},{"key":"50k - 100k","from":50001,"to":100000},{"key":"100k - 200k","from":100001,"to":200000},{"key":"200k - 300k","from":200001,"to":300000},{"key":"300k - 500k","from":300001,"to":5000000},{"key":"500k - 1M","from":500001,"to":1000000},{"key":"1M +","from":1000001,"to":100000000}]}}}},"region_name6":{"filter":{"match_all":{}},"aggs":{"region_name_fr.keyword":{"terms":{"field":"region_name_fr.keyword","size":10}},"region_name_fr.keyword_count":{"cardinality":{"field":"region_name_fr.keyword"}}}},"department_name7":{"filter":{"match_all":{}},"aggs":{"department_name.keyword":{"terms":{"field":"department_name.keyword","size":10}},"department_name.keyword_count":{"cardinality":{"field":"department_name.keyword"}}}},"primarypropertytype_name_fr8":{"filter":{"match_all":{}},"aggs":{"primarypropertytype_name_fr.keyword":{"terms":{"field":"primarypropertytype_name_fr.keyword","size":50}},"primarypropertytype_name_fr.keyword_count":{"cardinality":{"field":"primarypropertytype_name_fr.keyword"}}}},"bedrooms9":{"filter":{"match_all":{}},"aggs":{"bedrooms":{"range":{"field":"nrbedrooms","ranges":[{"key":"Tout"},{"key":"1-2","from":0,"to":2},{"key":"3-4","from":3,"to":4},{"key":"5-10","from":5,"to":10},{"key":"10 +","from":10,"to":300000}]}}}},"land_m210":{"filter":{"match_all":{}},"aggs":{"land_m2":{"range":{"field":"land_m2","ranges":[{"key":"Tout"},{"key":"0","from":0,"to":0},{"key":"1 - 100","from":1,"to":100},{"key":"200 - 1 000","from":201,"to":1000},{"key":"1 000 - 5 000","from":1001,"to":5000},{"key":"5 000 - 10 000","from":5001,"to":10000},{"key":"10 000 - 100 000","from":100001,"to":1000000},{"key":"1 000 000+","from":1000001,"to":100000000}]}}}}},"size":10000,"from":0,"sort":[{"_score":"desc"}],"highlight":{"fields":{"propname_fr":{},"pubtown":{}}},"_source":["propref","propname_fr","property_id","image_0","image_0_thumb_200","image_0_thumb_400","image_0_thumb_800","image_0_thumb_100","department_name","region_name_fr","pubtown","nrbedrooms","nrbathrooms","region_id","price","land_m2","habitable_m2","primarypropertytype_name_fr"]}
```

Stats: ~5000ms
