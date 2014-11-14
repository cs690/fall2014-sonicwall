#coding:utf-8  
import os.path
import json
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

class WSHandler(tornado.websocket.WebSocketHandler):

    def check_origin(self, origin):
        print 'Origin: ' + origin
        return True

    def open(self):
        self.id = self.request.headers['Sec-WebSocket-Key']
        self.subprotocol = self.request.headers['Sec-WebSocket-Protocol']
        if self.subprotocol == 'client-protocol':
            self.type = 'client'
            self.application.clients[self.id] = self
        elif self.subprotocol == 'service-protocol':
            self.type = 'service'
            self.application.services[self.id] = self
        else:
            self.type = 'default'
            self.application.connections[self.id] = self
        print 'New connection: ' + self.id
        print 'Sub protocol: ' + self.subprotocol + '\n'

    def on_message(self, message):
        print 'Message from: ' + self.id
        print message
        result = json.loads(message)
        if result.get('h') and result.get('d'):
            self._parse_message(result)
        else:
            print 'Invalid message'
    
    def on_close(self):
        print 'Connection closing: ' + self.id
        if self.subprotocol == 'client-protocol':
            del self.application.clients[self.id]
        elif self.subprotocol == 'service-protocol':
            del self.application.services[self.id]
        else:
            del self.application.connections[self.id]
        print 'Connection closed\n'

    def select_subprotocol(self, subprotocols):
        print subprotocols
        if len(subprotocols) == 1:
            self.subprotocol = subprotocols[0]
            return self.subprotocol if self.subprotocol in self.application.available_subprotocols else None
        else:
            return None

    def _parse_message(self, mObject):
        print 'Message format accepted'
        if self.subprotocol == 'echo-protocol':
            if mObject['h']['cmd'] == 'print-alive':
                self.application.print_connections()
        elif self.subprotocol == 'client-protocol':
            print 'Client connection accepted'
            if mObject['h']['cmd'] == 'broadcast':
                print 'start broadcasting'
                if mObject['h']['des'] == 'ac':
                    for conn in self.application.clients.values():
                        #As a client or service I expected to get pure data
                        #But this server must receive control message
                        if self != conn:
                            conn.write_message(json.dumps(mObject['d']))
                if mObject['h']['des'] == 'as':
                    print 'to all the services.\n'
                    for conn in self.application.services.values():
                        print 'Target server: ' + conn.id
                        print json.dumps(mObject['d'])
                        conn.write_message(json.dumps(mObject['d']))
            elif mObject['h']['cmd'] == 'transfer':
                if self.application.clients.get(mObject['h']['des']):
                    self.application.clients[mObject['h']['des']].write_message(json.dumps(mObject['d']))
                if self.application.services.get(mObject['h']['des']):
                    self.application.services[mObject['h']['des']].write_message(json.dumps(mObject['d']))
        elif self.subprotocol == 'service-protocol':
            print 'Service connection accepted'
            if mObject['h']['cmd'] == 'broadcast':
                if mObject['h']['des'] == 'ac':
                    for conn in self.application.clients.values():
                        #As a client or service I expected to get pure data
                        #But this server must receive control message
                        conn.write_message(json.dumps(mObject['d']))
                if mObject['h']['des'] == 'as':
                    for conn in self.application.services.values():
                        if self != conn:
                            conn.write_message(json.dumps(mObject['d']))
                print 'Finish broadcasting\n'

class Application(tornado.web.Application):

    def __init__(self):
        
        self.clients = {}
        self.services = {}
        self.connections = {}
        self.available_subprotocols = ['echo-protocol', 'client-protocol', 'service-protocol']

        handlers = [
            (r'/', WSHandler),
        ]
        tornado.web.Application.__init__(self, handlers)

    def print_connections(self):
        print 'Alive clients:'
        print self.clients
        print 'Alive services:'
        print self.services
        print 'Alive others:'
        print self.connections

    def broadcast(protocol, data):
        pass

if __name__ == '__main__':
    application = Application()
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8080)
    tornado.ioloop.IOLoop.instance().start()