#!/usr/bin/env ruby

require "csv"
require 'set'

time_span_count = 100

data = CSV.read('sfgate_with_geoip.csv').map! { |s| [s[1].to_f, s[4]]}
header = data.shift
times = data.map { |e| e.first }
time_min = 0
time_max = times.max
protocols = Set.new

h = data.group_by{|d|
  d.first.floor
}.inject({}) { |h, (k, v)|
  v=v.group_by{|t| t.last}
     .inject(Hash.new(0)) { |h, (k,v)| protocols.add(k); h[k]=v.size; h }
  h[k] = v
  h
}

names = protocols.to_a
result = [["TIME_SPAN"] + names]
h.each_pair {|k,v|
  result.push([k] + names.map { |e| v[e] })
}

CSV.open("data.csv", "wb") { |c| result.each { |i| c << i } }
