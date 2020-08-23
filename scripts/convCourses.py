import re
import json

inputf = open('courses.json')
jsonarray = json.load(inputf)

result = {}

for item in jsonarray:
    course_key = re.search('[A-Ö]{1,5}', item)[0]
    try:
        result[course_key]
    except:
        result[course_key] = []
    course_number = re.search('[0-9]{1,3}', item)[0]
    result[course_key].append(course_number)

out = json.dumps(result, sort_keys=True, indent=4, ensure_ascii=False)

of = open('out.json', 'w')
of.write(out)
of.close()