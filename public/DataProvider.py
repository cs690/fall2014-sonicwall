import time
import numpy as np
from sklearn import datasets
from sklearn.cluster import KMeans
import json

import tornado.websocket
from tornado import httpclient
from tornado import gen

def unwrap_data(message):
    return json.loads(json.loads(message).encode('ascii','ignore'))

def wrap_data(data):
    r = json.dumps({"h":{"cmd":"broadcast", "des":"ac"}, "d": data})
    print r
    return r

def process_message(message):
    data = unwrap_data(message)
    #Logic here
    result = wrap_data(data)
    return result

@gen.coroutine
def main():

    ds = open("sfgate.csv")

    @gen.coroutine
    def on_message_received(message_future):
        message = yield message_future
        print 'message received:\n' + str(message) + '\n'
        result_message = process_message(message)
        client.write_message(result_message)#send clustering result back to the server
        client.read_message(on_message_received)

    print 'connection start'
    client = yield tornado.websocket.websocket_connect(httpclient.HTTPRequest('ws://localhost:8080/', headers={'Sec-WebSocket-Protocol': 'service-protocol'}))
    #client.read_message(on_message_received)
    while 1:
        time.sleep(0.1)
        line = ds.readline()
        if not line:
            ds = open("sfgate.csv")
            continue
        print line
        client.write_message(wrap_data(line))

if __name__ == '__main__':
    tornado.ioloop.IOLoop.instance().run_sync(main)
    tornado.ioloop.IOLoop.instance().start()