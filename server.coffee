stylus = require('stylus')
express = require('express')
app = express()
server = require('http').createServer(app)
io = require('socket.io').listen(server)
xmlrpc = require('xmlrpc')
fs = require('fs')
mongoose = require('mongoose')
Schema = mongoose.Schema

# Mongoose
mongo = mongoose.createConnection('localhost', 'test')
db = {}

productSchema = new Schema
  name: String
  category: String
  shortDescription: String
  description: String
  price: Number
db['products'] = mongo.model('Product', productSchema)

# Express
app.configure ->
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use stylus.middleware({src: __dirname + '/src', dest: __dirname + '/public'})
  app.use express.static(__dirname + '/public')
  app.use app.router
app.configure 'development', -> app.use express.errorHandler({dumpExceptions: true, showStack: true})
app.configure 'production', -> app.use express.errorHandler()

#db = 'foobar'
#uid = 1
#pwd = 'admin'
#host = 'localhost'
#domain = []

#port = 8069
#lc = xmlrpc.createClient({ host: host, port: port, path: '/xmlrpc/common' })
#fc = xmlrpc.createClient({ host: host, port: port, path: '/xmlrpc/object' })
#users = {}

app.get '/data/:collection', (req, res) ->
  db[req.params.collection].find().exec (err, coll) ->
    console.error(err) if err; res.json(200, coll)
app.get '/data/:collection/:id', (req, res) ->
  db[req.params.collection].findOne(name: req.params.id).exec (err, coll) ->
    console.error(err) if err; res.json(200, coll)
app.get '/*', (req, res) -> res.render('index.jade', title: 'OpenERP')

#io.sockets.on 'connection', (socket) ->
  #logged = (uid) ->
    #socket.uid = uid
    #users[uid].online = true
    #users[uid].sids.push(socket.id)
    #socket.broadcast.emit('connect', uid)
    #data = {user: users[uid], users: {id: v.id, name: v.name, image: v.image, online: v.online} for k, v of users}
    #socket.emit('connected', data)
    #socket.emit('pm', msg) for msg in users[uid].messages
    #users[uid].messages = []

  #sendMessageLog = (data) ->
    #db['Message'].find().or([{from: socket.uid, to: data}, {from: data, to: socket.uid}]).exec (err, msgs) ->
      #console.error(err) if err
      #socket.emit('messageLog', {uid: data, msgs: msgs})

  #sendLastMessages = ->
    #mp =
      #map: ->
        #emit(@from, @) if @to is uid
        #emit(@to, @) if @from is uid
      #reduce: (k, v) ->
        #max = new Date(81,4,20)
        #val = null
        #v.forEach (msg) ->
          #if msg.time > max
            #max = msg.time
            #val = msg
        #return val
      #out: {replace: 'lastMessages'}
      #scope: {uid: socket.uid}
    #Message.mapReduce mp, (err, model) ->
      #if err then console.error(err) else model.find().exec (err, docs) ->
        #socket.emit('lastMessages', {uid: d._id, msg: d.value.msg, time: d.value.time} for d in docs)

  #socket.on 'disconnect', ->
    #if socket.uid?
      #users[socket.uid].sids.splice(users[socket.uid].sids.indexOf(socket.id), 1)
      #if users[socket.uid].sids.length is 0
        #users[socket.uid].online = false
        #io.sockets.emit('disconnect', socket.uid)
  #socket.on 'logged', (data) -> logged(data.uid)
  #socket.on 'login', (data) ->
    #lc.methodCall 'login', [db, data.login, data.pwd], (err, uid) ->
      #if uid then logged(uid.toString()) else socket.emit 'error', 'Wrong login or password'
  #socket.on 'pm', (data) ->
    #d = JSON.parse(data)
    #d.time = new Date()
    #(new db['Message'](d)).save (err) -> console.error(err) if err
    #if users[d.to].online
      #io.sockets.socket(sid).emit('pm', d) for sid in users[d.to].sids
    #else
      #users[d.to].messages.push(d)
    #sendMessageLog()
    #sendLastMessages()
    #io.sockets.socket(sid).emit('pm', d) for sid in users[d.from].sids
  #socket.on 'getMessageLog', sendMessageLog
  #socket.on 'getLastMessages', sendLastMessages
server.listen(3000)
console.log('http://localhost:3000')
