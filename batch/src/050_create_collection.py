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

url = "https://app.toyobunko-lab.jp/iiif/2/collection/18K00073"

prefix = "https://static.toyobunko-lab.jp/u-renja"

df = requests.get(url).json()

manifests = df["manifests"]

manifests2 = []

for i in range(len(manifests)):

    print(i+1, len(manifests))

    m = manifests[i]

    if "勘同目録" in m["label"]:
        continue

    id = m["@id"]

    hash = id.split("/")[-2]

    path = "../../static/iiif2/"+hash+"/manifest.json"

    os.makedirs(os.path.dirname(path), exist_ok=True)

    if not os.path.exists(path):
        df2 = requests.get(id).json()

        f2 = open(path, 'w')
        json.dump(df2, f2, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))
        f2.close()

    with open(path) as f:
        df2 = json.load(f)

    m["thumbnail"] = df2["thumbnail"]
    m["metadata"] = df2["metadata"]
    m["@id"] = prefix + "/iiif2/" + hash + "/manifest.json"

    manifests2.append(m)

df["manifests"] = manifests2
df["vhint"] = "use-thumb"
df["label"] = "酉蓮社本"
df["@id"] = prefix + "/iiif2/collection/top.json"

del df["metadata"]
del df["related"]
del df["seeAlso"]

f2 = open("../../static/iiif2/collection/top.json", 'w')
json.dump(df, f2, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))