#!/usr/bin/env ruby

filename = 'sfgate'
num_of_records = 10

require "csv"
require 'json'

class Hash
  def map(&block)
    if block_given?
      self.inject({}) { |h, (k,v)| h[k] = yield(v); h }
    else
      raise "block is needed for map."
    end
  end
end

$ip_to_name = {}
def nslookup(ip)
  return $ip_to_name[ip] if $ip_to_name[ip]

  begin
    print "Looking up for #{ip}..."
    name = `nslookup #{ip}`.match(/name = (.*)\.$/)[1]
    puts "Found"
    $ip_to_name[ip] = name
  rescue StandardError => e
    puts "Missing"
    ip
  end
end

#
#
#   `7MM"""Mq.
#     MM   `MM.
#     MM   ,M9 `7Mb,od8 .gP"Ya `7MMpdMAo.  ,6"Yb.  `7Mb,od8 .gP"Ya
#     MMmmdM9    MM' "',M'   Yb  MM   `Wb 8)   MM    MM' "',M'   Yb
#     MM         MM    8M""""""  MM    M8  ,pm9MM    MM    8M""""""
#     MM         MM    YM.    ,  MM   ,AP 8M   MM    MM    YM.    ,
#   .JMML.     .JMML.   `Mbmmd'  MMbmmd'  `Moo9^Yo..JMML.   `Mbmmd'
#                                MM
#                              .JMML.
# IP,Country Code,Country,Region Code,Region,City,Zip code,Latitude,Longitude,Area Code,Metro Code
geoip = CSV.read('geoip.csv')
# hash table from ip to [Latitude, Longitude]
ip_to_geo = geoip.inject({}) { |h, item| h[item[0]] = [item[7], item[8]]; h }

# "No.","Time","Source","Destination","Protocol","Length","Info"
data = CSV.read("#{filename}.csv")
# remove header
data.shift
# group by name "Source - Destination - Protocol"
grouped_data = data.group_by { |entry| "#{entry[2]} - #{entry[3]} - #{entry[4]}" }
# get the total length
sizes = grouped_data.map{|group|
  group.map{|entry| entry[5].to_i}.reduce(&:+)
}.to_a
# find the top records
top_records = sizes.sort_by {|item| -item.last}.take(num_of_records) # top 10


#
#
#    .M"""bgd
#   ,MI    "Y
#   `MMb.   `7MM  `7MM  `7MMpMMMb.pMMMb.  `7MMpMMMb.pMMMb.   ,6"Yb.  `7Mb,od8 `7M'   `MF'
#     `YMMNq. MM    MM    MM    MM    MM    MM    MM    MM  8)   MM    MM' "'   VA   ,V
#   .     `MM MM    MM    MM    MM    MM    MM    MM    MM   ,pm9MM    MM        VA ,V
#   Mb     dM MM    MM    MM    MM    MM    MM    MM    MM  8M   MM    MM         VVV
#   P"Ybmmd"  `Mbod"YML..JMML  JMML  JMML..JMML  JMML  JMML.`Moo9^Yo..JMML.       ,V
#                                                                                ,V
#                                                                             OOb"
summary_data = top_records.map { |(group_name, total_length)|
  d = group_name.split(' - ')
  source_geo = ip_to_geo[d[0]]
  dest_geo = ip_to_geo[d[1]]
  [nslookup(d[0]), nslookup(d[1]), d[2], total_length,
  source_geo[0], source_geo[1], dest_geo[0], dest_geo[1]]
}
# add new header
summary_header = ["Source", "Destination", "Protocol", "TotalLength",
  "SourceLatitude", "SourceLongitude", "DestinationLatitude", "DestinationLongitude"]

# JSON
summary_json = summary_data.map { |e|
  summary_header.zip(e).to_h
}.to_json
# write to file
File.open("#{filename}_summary.json", 'wb').write(summary_json)

# CSV
summary_data.unshift(summary_header)
# write to file
CSV.open("#{filename}_summary.csv", "wb") do |f|
  summary_data.each { |line| f << line }
end



#
#                       ,,
#    .M"""bgd          *MM                          mm
#   ,MI    "Y           MM                          MM
#   `MMb.   `7MM  `7MM  MM,dMMb.  ,pP"Ybd  .gP"Ya mmMMmm
#     `YMMNq. MM    MM  MM    `Mb 8I   `" ,M'   Yb  MM
#   .     `MM MM    MM  MM     M8 `YMMMa. 8M""""""  MM
#   Mb     dM MM    MM  MM.   ,M9 L.   I8 YM.    ,  MM
#   P"Ybmmd"  `Mbod"YML.P^YbmdP'  M9mmmP'  `Mbmmd'  `Mbmo
#
#
subset_data = top_records.inject([]) { |a, (group_name, total_length)|
  # old: "No.","Time","Source","Destination","Protocol","Length","Info"
  # new: "Time","Source","Destination","Protocol","Length"
  data = grouped_data[group_name].map {|d| [d[1].to_i, d[2], d[3], d[4], d[5].to_i] }
  values = data.group_by { |d|
    "#{d[0]} - #{d[1]} - #{d[2]} - #{d[3]}"
  }.map { |v|
    total = v.map { |e| e.last }.reduce(&:+)
    v[0][0..3] + [total]
  }.values
  a += values
}.sort
# new header
subset_header = ["Time","Source","Destination","Protocol","TotalLength"]

# JSON
subset_json = subset_data.map { |e|
  subset_header.zip(e).to_h
}.to_json
# write to file
File.open("#{filename}_subset.json", 'wb').write(subset_json)

# CSV
subset_data.unshift(subset_header)
# write to file
CSV.open("#{filename}_subset.csv", 'wb') do |f|
  subset_data.each { |line| f << line }
end

