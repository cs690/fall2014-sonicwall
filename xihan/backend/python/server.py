#coding:utf-8  
import os.path
import json
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
 
import console

connections = set()

class WSHandler(tornado.websocket.WebSocketHandler):

    def check_origin(self, origin):
        return True

    def open(self):
        connections.add(self)
        print 'new connection'

    def on_message(self, message):
        print 'message received %s' % message
        [con.write_message(message) for con in connections]
    
    def on_close(self):
        connections.remove(self)
        print 'connection closed'

    #def select_subprotocol(self, subprotocols):
    #    return 'echo-protocol'

application = tornado.web.Application([
    (r'/', WSHandler),
])

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8080)
    tornado.ioloop.IOLoop.instance().start()