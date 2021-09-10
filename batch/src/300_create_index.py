import urllib.request
from bs4 import BeautifulSoup
import csv
from time import sleep
import pandas as pd
import json
import urllib.request
import os
from PIL import Image
import yaml
import requests

with open("data/itaiji.json") as f:
    dd = json.load(f)


def itaiji(data):
    for key in dd:
        for v in dd[key]:
            data = data.replace(v, key)

    return data

#####

def getManifests():

    with open("../../static/iiif2/collection/top.json") as f:
        collection2 = json.load(f)

    map = {}

    manifests2 = collection2["manifests"]
    for m in manifests2:
        no = ""
        id = m["@id"]

        for obj in m["metadata"]:
            if obj["label"] == "Description":
                no = obj["value"][0].split(" ")[1]

        no = int(no)

        if no not in map:
            map[no] = []
        map[no].append({
            "id": id,
            "label": m["label"]
        })

    return map

map = getManifests()

with open("../../static/iiif/collection/top.json") as f:
    collection = json.load(f)

manifests = collection["manifests"]

actions = []



for m in manifests:

    fulltext = ""

    item = {
        "objectID" : str(m["label"]).zfill(4),
    }

    metadata = m["metadata"]

    for me in metadata:
        
        label = me["label"]
        value = me["value"]

        if label == "通番":
            value = int(value)

        if label not in item:
            item[label] = []
        
        item[label].append(value)

        fulltext += ", " + str(value)

    id = item["objectID"]

    id = int(id)

    if id in map:
        item["relatedLink"] = map[id]

    # 変換
    fulltext = itaiji(fulltext)
    
    item["fulltext"] = fulltext
    actions.append(item)

keys = []
for item in actions:
    for label in item:
        if label not in keys:
            keys.append(label)

for item in actions:
    for key in keys:
        if key not in item:
            item[key] = [""]

f2 = open("../../static/data/index.json", 'w')
json.dump(actions, f2, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))