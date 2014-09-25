from pandas import read_csv
import joblib
import os
import httplib

'''
if os.path.isfile("sfgate.pickle"):
    print "pickle file found"
    data = joblib.load("sfgate.pickle");
else:
    print "start loading file"
    data = read_csv("sfgate.csv")
    joblib.dump(data, "sfgate.pickle");
'''

data = read_csv("sfgate.csv")	
	
ipList = [];
for ip in list(data["Source"]):
    if ip not in ipList:
        ipList.append(ip);

for ip in list(data["Destination"]):
    if ip not in ipList:
        ipList.append(ip);

print len(ipList)

geoipurl = "freegeoip.net"
content = '';
for ip in ipList:
    url = "/csv/" + str(ip);
    connection = httplib.HTTPConnection(geoipurl)
    connection.request("GET", url)
    response = connection.getresponse()
    content += response.read().decode()
	
print "Finish loading, save to csv file"

f = open("geoipresult\geoip.csv",'wb')
f.write(content)
f.close()
print "Done"