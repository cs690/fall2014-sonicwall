import time

import numpy as np
from sklearn import datasets
from sklearn.cluster import KMeans
import json

import tornado.websocket
from tornado import httpclient
from tornado import gen

def runCluster(data):
    result = []
    X = np.array(data)
    n = 3
    clf = KMeans(n)
    r = clf.fit_predict(X)
    result = [X[np.where(r == v)] for v in range(n)]
    return np.array(result).tolist()

@gen.coroutine
def main():

    def send_all_results(results):
        for i in range(len(results)):
            r = results[i]
            o = []
            for d in r:
                o.append(list(d))
            m = json.dumps({"h":{"cmd":"broadcast", "des":"ac"}, "d": o})
            print m
            client.write_message(m)#send clustering result back to the server

    @gen.coroutine
    def print_message(message_future):
        message = yield message_future
        print 'message received:'
        print message + '\n'
        t_message = json.loads(json.loads(message).encode('ascii','ignore'))
        r_message = runCluster(t_message)
        send_all_results(r_message)
        client.read_message(print_message)

    print 'connection start'
    client = yield tornado.websocket.websocket_connect(httpclient.HTTPRequest('ws://localhost:8080/', headers={'Sec-WebSocket-Protocol': 'service-protocol'}))
    client.read_message(print_message)

if __name__ == '__main__':
    tornado.ioloop.IOLoop.instance().run_sync(main)
    tornado.ioloop.IOLoop.instance().start()