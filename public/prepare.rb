#!/usr/bin/env ruby

filename = 'sfgate'
num_of_records = 10

require "csv"

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
# new data
new_data = top_records.map { |(group_name, total_length)|
  d = group_name.split(' - ')
  source_geo = ip_to_geo[d[0]]
  dest_geo = ip_to_geo[d[1]]
  [nslookup(d[0]), nslookup(d[1]), d[2], total_length,
  source_geo[0], source_geo[1], dest_geo[0], dest_geo[1]]
}
# add new header
new_data.unshift([
  "Source", "Destination", "Protocol", "TotalLength",
  "SourceLatitude", "SourceLongitude", "DestinationLatitude", "DestinationLongitude"
  ])

CSV.open("#{filename}_summary.csv", "wb") do |f|
  new_data.each { |line| f << line }
end


# JSON
require 'json'

header = new_data.shift
hash = new_data.map { |e|
  header.zip(e).to_h
}

File.open("#{filename}_summary.json", 'wb').write(hash.to_json)
