set -e -o pipefail

python 050_create_collection.py
python 030_create_manifest.py
python 040_create_advanced.py
python 200_create_excel.py
python 300_create_index.py
python 301_create_advanced.py
python 302_create_tree.py
python 401_fix_thumb_manifests.py
python 402_fix_thumb_collection.py