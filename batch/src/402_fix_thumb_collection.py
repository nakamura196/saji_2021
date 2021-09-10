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

with open("../../static/iiif2/collection/top.json") as f:
    collection = json.load(f)

manifests = collection["manifests"]

for i in range(len(manifests)):

    print(i+1, len(manifests))

    manifest = manifests[i]

    mid = manifest["@id"]

    uuid = mid.split("/")[-2]

    path = "../../static/iiif2/" + uuid + "/manifest.json"

    with open(path) as f:
        df = json.load(f)

    canvases = df["sequences"][0]["canvases"]
    canvas = canvases[0]

    thumbnail = canvas["images"][0]["resource"]["service"]["@id"] + "/full/200,/0/default.jpg"

    manifest["thumbnail"]["@id"] = thumbnail

f2 = open("../../static/iiif2/collection/top.json", 'w')
json.dump(collection, f2, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))