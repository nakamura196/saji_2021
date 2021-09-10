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

prefix = "https://static.toyobunko-lab.jp/u-renja"
opath = "../../static/iiif/collection/advanced.json"


with open("config.json") as f:
    config = json.load(f)

path = config["path"]


df_item = pd.read_excel(path, sheet_name="詳細", header=None, index_col=None, engine="openpyxl")

r_count = len(df_item.index)
c_count = len(df_item.columns)

map = {}

for i in range(0, c_count):
    map[i] = df_item.iloc[0, i]

manifests = []

for j in range(1, r_count):

    print(str(j)+"/"+str(r_count))

    metadata = []

    if pd.isnull(df_item.iloc[j, 0]):
        continue

    facets = []

    for i in map:
        label = map[i]
        value = df_item.iloc[j, i]
        if not pd.isnull(value) and value != 0:
            
            
            value = str(value).strip()

            if label == "卷末附録(1)" or label == "卷末附録(2)" or label == "卷末附録(3)" or label == "卷末附録(4)":
                if label == "卷末附録(1)":
                    metadata.append({
                        "label": "卷末附録_facet",
                        "value" : facets
                    })
                # label = "卷末附録_facet"
                facets.append(value)
        else:
            value = ""
            
            
        metadata.append({
            "label": label,
            "value" : value
        })

        '''
        elif label == "画像フォルダ名(1)":
            metadata.append({
                "label": "画像有無",
                "value" : "画像なし"
            })
        '''    

    id = str(j).zfill(6)

    manifest = {
        "@context": "http://iiif.io/api/presentation/2/context.json",
        "@type": "sc:Manifest",
        "@id": prefix + "/iiif/"+id+"/manifest.json",
        # "license": "http://example.org",
        "attribution": "酉蓮社 / Urenja",
        "label": id,
        "metadata": metadata
    }

    opath2 = "../../static/iiif/"+id+"/manifest.json"
    dirname = os.path.dirname(opath2)

    os.makedirs(dirname, exist_ok=True)

    f2 = open(opath2, 'w')
    json.dump(manifest, f2, ensure_ascii=False, indent=4,
                sort_keys=True, separators=(',', ': '))

    manifests.append(manifest)

collection = {
    "@context": "http://iiif.io/api/presentation/2/context.json",
    "@id": prefix + "/iiif/top.json",
    "@type": "sc:Collection",
    "attribution": "酉蓮社",
    "manifests" : manifests,
    "label" : "酉蓮社本目録・詳細目録"
}

f2 = open(opath, 'w')
json.dump(collection, f2, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))

