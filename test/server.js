
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express();

// middleware

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/..'));

// faux database

var db = { lists: [], contacts: [], list_contacts: [] };

// service route to initialize dbase
app.post('/fixtures', function(req, res){
  var type = req.param('type','default')
  initdb(type);
  res.send(200);
})

// routes

app.get('/contact-list/all', function(req, res){
  var page = req.param('page',0)
    , limit = req.param('limit',100)
    , total = db.lists.length
    , lists = db.lists.slice(page * limit, (page * limit) + limit)

  res.send({
    meta: {
      page: page,
      limit: limit,
      total: total
    },
    contactLists: lists
  });
  
})

app.get('/contact-list/:id', function(req, res){
  var id = req.params.id
    , list = db.lists[id]
    , contacts = []
  for (var i=0;i<db.list_contacts.length;++i){
    var rel = db.list_contacts[i]
    if (rel.list_id == id){
      contacts.push( db.contacts[rel.contact_id] );
    }
  }
  
  res.send({
    contactList: list,
    contacts: contacts
  });
})

app.listen(3000);
console.log('test server listening on port 3000');


// private

function initdb(type){
  db.lists         = fixtures[type].lists || [];
  db.contacts      = fixtures[type].contacts || [];
  db.list_contacts = fixtures[type].list_contacts || [];
}


var fixtures = {}

/*
var lists = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
for (var i=0;i<lists.length;++i) {
  fixtures['default'].lists.push({id: i, name: lists[i]});
}
*/

fixtures.default = {
  lists: [
    {id: 0, name: "A"},
    {id: 1, name: "B"},
    {id: 2, name: "C"}
  ],
  contacts: [
    {"id":0,"first":"Walda","last":"Alkinson","email":"lkjack8@wayne.com","phone":"174 331 2919"},
    {"id":1,"first":"Jen","last":"Resnick","email":"angelica.engel@gmail.edu","phone":null},
    {"id":2,"first":"Jane","last":"Weithorn","email":"jo@umich.com","phone":null},
    {"id":3,"first":"Akosua","last":null,"email":"angelica.engel@gmail.edu","phone":"982-728-5928"},
    {"id":4,"first":"Katie","last":"Shirley","email":"india.mansour@aol.com","phone":null},
    {"id":5,"first":"Ami","last":"Rizzo","email":"danielleatkinson@gmail.com","phone":"836-892-8268"},
    {"id":6,"first":"Stephen","last":"Halpern","email":"rolfmagic@gmail.org","phone":"495-280-9680"},
    {"id":7,"first":"Cyan","last":"Ho","email":"j-sheryl@gmail.com","phone":"884-574-1233"},
    {"id":8,"first":"Elizabeth","last":null,"email":"danacutts@gmail.org","phone":"534-822-4768"},
    {"id":9,"first":"Shahrzad","last":"Rosler","email":"selijah@yahoo.com","phone":"337-881-7227"},
    {"id":10,"first":"Martha","last":"Bear","email":"ami.worthen@gmail.edu","phone":"152-092-4570"},
    {"id":11,"first":"Linda","last":"Forman","email":"dledford@aol.com","phone":null},
    {"id":12,"first":"Rebecca","last":"Miller","email":"clarahalpern@yahoo.edu","phone":null},
    {"id":13,"first":"Deede","last":"Saoirse","email":"craig@hotmail.com","phone":"387 912 6035"},
    {"id":14,"first":"Karen","last":"Palo","email":"k262walker@shetroit.org","phone":null},
    {"id":15,"first":"Martha","last":"Cahn","email":"thoroswet_3@gmail.com","phone":"521-585-0196"},
    {"id":16,"first":"Aaron","last":"Quinn","email":"jim@unca.ca","phone":"263 297 7139"},
    {"id":17,"first":"Josephine","last":"Green","email":"danacutts@hotmail.com","phone":null},
    {"id":18,"first":"Becca","last":"Walton","email":"danielle@yahoo.org","phone":null},
    {"id":19,"first":"Julie","last":"Foster","email":"jharrada007@gmail.ca","phone":null},
    {"id":20,"first":"Linda","last":"Medley","email":"jenniferkfletcher@hotmail.edu","phone":null},
    {"id":21,"first":"Jim","last":"Ledford","email":"sarabrynne@uic.com","phone":null},
    {"id":22,"first":"Dede","last":"Boyle","email":"m.goodjohnson@wort-fm.com","phone":null},
    {"id":23,"first":"Winnie","last":"Lisonski","email":"rhh23@aol.edu","phone":null},
    {"id":24,"first":"Lori","last":"LeMatrieu","email":"susanbarak@gmail.com","phone":null},
    {"id":25,"first":"Anna","last":"Diers","email":"alsace@unca.ca","phone":null},
    {"id":26,"first":"Karen","last":"Engel","email":"reubenjs@gmail.com","phone":null}
  ],
  list_contacts: [
    {list_id: 0, contact_id: 0},
    {list_id: 0, contact_id: 2},
    {list_id: 0, contact_id: 4},
    {list_id: 0, contact_id: 6},
    {list_id: 0, contact_id: 8},
    {list_id: 0, contact_id: 11},
    {list_id: 0, contact_id: 13},
    {list_id: 0, contact_id: 15},
    {list_id: 0, contact_id: 17},
    {list_id: 1, contact_id: 1},
    {list_id: 1, contact_id: 3},
    {list_id: 1, contact_id: 5},
    {list_id: 1, contact_id: 7},
    {list_id: 1, contact_id: 9},
    {list_id: 1, contact_id: 11},
    {list_id: 1, contact_id: 12},
    {list_id: 1, contact_id: 13},
    {list_id: 1, contact_id: 14},
    {list_id: 1, contact_id: 15},
    {list_id: 1, contact_id: 16},
    {list_id: 1, contact_id: 17},
    {list_id: 1, contact_id: 18},
    {list_id: 1, contact_id: 19},
    {list_id: 1, contact_id: 21},
    {list_id: 2, contact_id: 20},
    {list_id: 2, contact_id: 21},
    {list_id: 2, contact_id: 22},
    {list_id: 2, contact_id: 23},
    {list_id: 2, contact_id: 24},
    {list_id: 2, contact_id: 25},
    {list_id: 2, contact_id: 26},
    {list_id: 2, contact_id: 1}
  ]
}


