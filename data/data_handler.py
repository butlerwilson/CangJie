from bs4 import BeautifulSoup
import requests
import json

from requests.models import guess_json_utf

def filter(in_file):
    print("reading wikipedia ...")
    start_html = requests.get("https://zh.wiktionary.org/wiki/Appendix:通用规范汉字表")
    soup = BeautifulSoup(start_html.text, 'lxml')
    _as = soup.find(attrs={"class": "wikitable"})
    chars = [a.text for a in _as.find_all(name="a")]
    lines = []
    print("filtering ...")
    with open(in_file, "r") as chaizi:
        for line in chaizi.readlines():
            if line[0] in chars and line not in lines:
                lines.append(line.strip())
    return lines

def json_formatter(lines):
    json_list = []
    key_set = set()
    for idx, line in enumerate(lines):
        kv = line.split("\t")
        key = kv[0]
        if key in key_set:
            continue
        key_set.add(key)
        values = kv[1::]
        json_list.append({
            "_id": idx,
            "key": key,
            "value": [sorted(v.split(" ")) for v in values]
        })
    return json_list


if __name__ == "__main__":
    with open("./temp.json", "w") as jf:
        lines = filter("chaizi-jt.txt")
        js = json_formatter(lines)
        for ljs in js:
            jf.write(json.dumps(ljs))
