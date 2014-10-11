from pandas import read_csv

data = read_csv("sfgate.csv")
ipinfo = read_csv("geoip.csv")

ipDict = {}
for i in range(len(ipinfo["IP"])):
	ipDict[ipinfo["IP"][i]] = [ipinfo["Latitude"][i], ipinfo["Longitude"][i]]

srcLatitude = []
srcLongitude = []
desLatitude = []
desLongitude = []
for ip in list(data["Source"]):
	srcLatitude.append(ipDict[ip][0])
	srcLongitude.append(ipDict[ip][1])
	
for ip in list(data["Destination"]):
	desLatitude.append(ipDict[ip][0])
	desLongitude.append(ipDict[ip][1])
	
data["Source Latitude"] = srcLatitude
data["Source Longitude"] = srcLongitude
data["Destination Latitude"] = desLatitude
data["Destination Longitude"] = desLongitude

data.to_csv("sfgate_with_geoip.csv")