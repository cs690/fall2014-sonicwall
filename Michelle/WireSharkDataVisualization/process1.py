#Usage: python process.py sfgate_with_geoip.csv output.tsv 1 TCP
import sys
import math

bin_size = float(sys.argv[3])
#target_protocol = sys.argv[4]
max_time = 0

first_line = True
with open(sys.argv[1]) as f:
    for line in f:
        if first_line:
            first_line = False
            continue
        items = line[:-1].split(',')

        max_time = float(items[1])

num_bins = int(math.ceil(max_time / bin_size) + 1)
HTTPtraffic = [0] * num_bins
DNStraffic = [0] * num_bins
TCPtraffic = [0] * num_bins

first_line = True
with open(sys.argv[1]) as f:
    for line in f:
        if first_line:
            first_line = False
            continue
        items = line[:-1].split(',')
        if(items[4] == 'TCP'):
            TCPtraffic[int(math.floor(float(items[1]) / bin_size))] += float(items[5])
        if(items[4] == 'HTTP'):
            HTTPtraffic[int(math.floor(float(items[1]) / bin_size))] += float(items[5])
        if(items[4] == 'DNS'):
            DNStraffic[int(math.floor(float(items[1]) / bin_size))] += float(items[5])

with open(sys.argv[2], 'w') as f:
    f.write('{0},{1},{2},{3}\n'.format('TIME_SPAN','HTTP','DNS','TCP'))
    for i in range(0, num_bins):
        #f.write('{0}\t{1}\n'.format(i, TCPtraffic[i]))
        f.write('{0},{1},{2},{3}\n'.format(i,HTTPtraffic[i],DNStraffic[i],TCPtraffic[i]))

