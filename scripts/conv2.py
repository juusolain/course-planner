import re
import json

inputf = open('courses.json')
jsonobj = json.load(inputf)

result = {}


for courseBaseKey in jsonobj:
    individualCourseArray = jsonobj[courseBaseKey]
    result[courseBaseKey] = []
    for course in individualCourseArray:
        try:
            originalCourseNum = course['after'][0]
            newNumber = int(originalCourseNum) - 1
            if originalCourseNum[0] == '0':
                newAfter = "0"+str(newNumber)
            else:
                newAfter = str(newNumber)
            course['after'] = newAfter
        except:
            print("no after")
        course['courseBaseKey'] = courseBaseKey
        course['courseKey'] = courseBaseKey+course['courseNumber']
        print(course)
        result[courseBaseKey].append(course)

out = json.dumps(result, sort_keys=True, indent=4, ensure_ascii=False)

of = open('out.json', 'w')
of.write(out)
of.close()