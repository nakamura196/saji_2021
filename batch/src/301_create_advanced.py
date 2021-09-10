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

with open("../../static/iiif/collection/advanced.json") as f:
    collection = json.load(f)

manifests = collection["manifests"]

actions = []

for m in manifests:

    fulltext = ""

    item = {
        "objectID" : str(m["label"]),
    }

    metadata = m["metadata"]

    for me in metadata:
        value = me["value"]
        label = me["label"]
        if value != "":
            if isinstance(value, str):
                if label not in item:
                    item[label] = []
                item[label].append(value)
                fulltext += ", " + value
            else:
                item[label] = value

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

f2 = open("../../static/data/advanced.json", 'w')
json.dump(actions, f2, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))