import os

with open("text.txt", "w+") as file:
    name = os.listdir('./userIcon')
    print name
    for name_line in name:

        name_line_arr = name_line.split('-')
        file.write("index:"+name_line_arr[0]+",name:" name_line_arr[1]+"\n")
