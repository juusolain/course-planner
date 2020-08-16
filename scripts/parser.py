from bs4 import BeautifulSoup
import codecs
import re

import json

f = codecs.open("courses.html", 'r')

data = f.read()
soup = BeautifulSoup(data)

root = soup.find('div', attrs={'id': 'main-tray-parent'})
trayDivs = soup.find_all('div', attrs={'class': 'tray-container'})

result = {}

for ti, div in enumerate(trayDivs):
    tray = div.find('ul')
    bars = tray.find_all('li', recursive=False)
    header = div.find('h2')
    headerText = header.contents[1]
    trayName = re.search('[0-9](?=\.jakso)', headerText)[0]
    trayResult = {}
    for i, bar in enumerate(bars):
        title = bar.find('span')
        groups = bar.find_all('a')
        barNumber = i+1
        trayResult[barNumber] = []
        for group in groups:
            key = group.string
            courseKey = key.split('.', 1)[0]
            courseNumber = int(re.search('[0-9]+', courseKey)[0])
            courseBaseKey = re.search('[A-Ö]+', courseKey)[0]
            ctitle = group.get('title')
            reMatch = re.search('(?<=Opettaja: )[A-Ö]{3} .*', ctitle)
            try:
                teacher = reMatch[0]
            except:
                teacher = "No teacher"
            groupObject = {
                'groupKey': key,
                'courseKey': courseKey,
                'courseNumber': courseNumber,
                'courseBaseKey': courseBaseKey,
                'teacher': teacher
            }
            trayResult[barNumber].append(groupObject)
    result[trayName] = trayResult

out = json.dumps(result, sort_keys=True, indent=4, ensure_ascii=False)

of = open('out.json', 'w')
of.write(out)
of.close()
f.close()

print("Parsed " + str(len(trayDivs)) + " trays")