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

with open("../../static/data/advanced.json") as f:
    collection = json.load(f)

tree = []

map = {}

for obj in collection:
    print(obj["objectID"])
    r = obj["連"][0]
    h = obj["箱"][0]
    k = obj["函册次"][0]

    if r not in map:
        map[r] = {}

    tmp = map[r]

    if h not in tmp:
        tmp[h] = []

    tmp = tmp[h]

    if k not in tmp:
        tmp.append(k)


f2 = open("../../static/data/tree.json", 'w')
json.dump(map, f2, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))