import sys

data = {}
types = ['HTTP', 'DNS', 'TCP']
for t in types:
  data[t] = {}

first_line = True
with open(sys.argv[1]) as f:
  for line in f:
    if first_line:
      first_line = False
      continue
    (ts, l1, l2, l3) = line[:-1].split('\t')
    data['HTTP'][ts] = l1
    data['DNS'][ts] = l2
    data['TCP'][ts] = l3
print(data)
with open(sys.argv[2], 'w') as f:
  parts = []
  for t in types:
    objs = ['\t{{\n\t\t"time_span" : {0},\n\t\t"length" : {1}\n\t}}'.format(ts, l) for (ts, l) in data[t].items()]
    values = '"values" : [\n' + ',\n'.join(objs)
    s = '{{"key" : "{0}",\n'.format(t) + values + '\n]}'
    parts.append(s)
  output = '[{0}]'.format(',\n'.join(parts))
  f.write(output)
