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
import glob

files = glob.glob("../../static/iiif2/*/manifest.json")

for file in files:
    with open(file) as f:
        manifest = json.load(f)

    canvases = manifest["sequences"][0]["canvases"]

    for i in range(len(canvases)):
        canvas = canvases[i]

        image = canvas["images"][0]["resource"]["service"]["@id"]

        canvas["thumbnail"]["@id"] = image + "/full/200,/0/default.jpg"

        if i == 0:
            manifest["thumbnail"]["@id"] = canvas["thumbnail"]["@id"]

    f2 = open(file, 'w')
    json.dump(manifest, f2, ensure_ascii=False, indent=4,
                sort_keys=True, separators=(',', ': '))