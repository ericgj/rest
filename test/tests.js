var assert  = require('timoxley-assert')
  , request = require('visionmedia-superagent')
  , REST    = require('rest')


// stupid models

function ContactList(attrs){
  for (var attr in attrs) this[attr] = attrs[attr];
  return this;
}

function Contact(attrs){
  for (var attr in attrs) this[attr] = attrs[attr];
  return this;
}

// resources

var listAll = REST('/contact-list/all')
listAll.parse = function(raw){
  return {
    contactLists: REST.collect(raw.contactLists, ContactList),
    total: raw.meta.total,
    page: raw.meta.page
  }
}

var listOne = REST('/contact-list/:id')
listOne.parse = function(raw){
  return {
    contactList: new ContactList(raw.contactList),
    contacts: REST.collect(raw.contacts, Contact)
  }
}

var listContacts = REST('/contact-list/:id/contact')
listContacts.dump = function(contacts){
  return {
    contacts: contacts
  }
}

var lists = REST('/contact-list')


function setupFixtures(type,done){
  request.post('/fixtures', {type: type}, function(){ done(); });
}
  
describe('REST', function(){
  describe('get', function(){
 
    beforeEach( function(done){
      setupFixtures('default',done);
    })

    it('/contact-list/all yields contactLists collection, total and page', function(done){
      listAll.get({}).end( function(err,obj,res){
        // console.log("object: %o", obj);
        assert(!err, "Got error response" + err);
        obj.contactLists.each( function(c) { assert.equal(c.constructor, ContactList); });
        assert.equal(0,obj.page);
        assert('obj.total > 0');
        done();
      })
    })

    it('/contact-list/:id yields contactList and contacts collection', function(done){
      listOne.get().end( function(err,obj,res){
        assert(!err, "Got error response" + err);
        assert.equal(obj.contactList.constructor, ContactList);
        obj.contacts.each( function(c) { assert.equal(c.constructor, Contact); });
        done();
      })
    })

    it('should set Accept header to specified type if given', function(){
      var exp = 'application/foo';
      var act = listOne.type(exp).get().request.getHeader('accept')
      assert.equal(act,exp);
    })

  })

  describe('post/put', function(done){
    

    // TODO improve this so it doesn't rely on checking private _data

    it('/contact-list should default the body to the passed model', function(){
      lists.post({}, new ContactList({name: 'Friends'}) );
      assert.equal('Friends', lists.request._data['name']);
    })

    it('/contact-list/:id/contact should set the body to include contacts from passed models', function(){
      var contacts = [ new Contact({id: 1}), new Contact({id: 7}), new Contact({id: 13}) ]
      listContacts.put({id: 3}, contacts);
      var act = listContacts.request._data['contacts'];
      var exp = [1,7,13];
      assert.equal(act.length,exp.length);
      for (var i=0;i<act.length;++i){
        assert.equal(act[i].id,exp[i]);
      }
    })

  })

})
