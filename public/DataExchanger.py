#coding:utf-8  
import os.path
import json
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

clients = {}
services = {}
connections = {}

available_subprotocols = ['echo-protocol', 'client-protocol', 'service-protocol']

def print_connections():
    print "Alive clients:"
    print clients
    print "Alive services:"
    print services
    print "Alive others:"
    print connections

class WSHandler(tornado.websocket.WebSocketHandler):

    def check_origin(self, origin):
        print "Origin: " + origin
        return True

    def open(self):
        print 'New connection'

    def on_message(self, message):
        print message
        result = json.loads(message)
        if self.subprotocol == 'echo-protocol':
            if result["h"]["cmd"] == "print-alive":
                print_connections()
        elif self.subprotocol == 'client-protocol':
            print "I'm a client."
            if result["h"]["cmd"] == "broadcast":
                print "start broadcasting"
                if result["h"]["des"] == "ac":
                    for conn in clients.values():
                        #As a client or service I expected to get pure data
                        #But this server must receive control message
                        if self != conn:
                            conn.write_message(json.dumps(result["d"]))
                if result["h"]["des"] == "as":
                    print "to all the services."
                    for conn in services.values():
                        print json.dumps(result["d"])
                        conn.write_message(json.dumps(result["d"]))
            elif result["h"]["cmd"] == "transfer":
                if clients.get(result["h"]["des"]):
                    clients[result["h"]["des"]].write_message(json.dumps(result["d"]))
                if services.get(result["h"]["des"]):
                    services[result["h"]["des"]].write_message(json.dumps(result["d"]))
        elif self.subprotocol == 'service-protocol':
            print "I'm a service"
            if result["h"]["cmd"] == "broadcast":
                if result["h"]["des"] == "ac":
                    for conn in clients.values():
                        #As a client or service I expected to get pure data
                        #But this server must receive control message
                        conn.write_message(json.dumps(result["d"]))
                if result["h"]["des"] == "as":
                    for conn in services.values():
                        if self != conn:
                            conn.write_message(json.dumps(result["d"]))
    
    def on_close(self):
        if self.subprotocol == "client-protocol":
            del clients[self.id]
        elif self.subprotocol == "service-protocol":
            del services[self.id]
        else:
            del connections[self.id]
        print 'connection closed'

    def select_subprotocol(self, subprotocols):
        print subprotocols
        if len(subprotocols) == 1:
            self.subprotocol = subprotocols[0];
            return self.subprotocol if self.subprotocol in available_subprotocols else None
        else:
            return None

application = tornado.web.Application([
    (r'/', WSHandler),
])

if __name__ == '__main__':
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8080)
    tornado.ioloop.IOLoop.instance().start()