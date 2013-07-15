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
listAll.read = function(raw){
  return {
    contactLists: REST.collect(raw.contactLists, ContactList),
    total: raw.meta.total,
    page: raw.meta.page
  }
}

var listOne = REST('/contact-list/:id')
listOne.read = function(raw){
  return {
    contactList: new ContactList(raw.contactList),
    contacts: REST.collect(raw.contacts, Contact)
  }
}


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
      var act = listOne.type(exp).get()._request.getHeader('accept')
      assert.equal(act,exp);
    })

  })
})

