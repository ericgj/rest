var request = require('superagent')
  , Collection = require('collection')
  , has = Object.hasOwnProperty

module.exports = REST;

function REST(path){
  REST.resources = REST.resources || {};
  var resource = REST.resources[path] = (REST.resources[path] || new Resource(path))
  return resource;
}

REST.collect = function(items,klass){
  items = ( isArray(items) ? items : [items] );
  return new Collection(items).map( function(it){ return new klass(it); });
}

function Resource(path){
  if (!(this instanceof Resource)) return new Resource(path);
  this.path = path;
  return this;
}

Resource.prototype.headers = function(headers){
  this._headers = this._headers || {};
  for (var h in headers) this._headers[h] = headers[h];
  return this;
}

/* note this sets the Accept header, not Content-Type */
Resource.prototype.type = function(type){
  this._type = type;
  return this;
}

Resource.prototype.query = function(val){
  if (!this._request) return this;
  this._request.query(val);
  return this;
}

Resource.prototype.get = function(vars){
  return this.request('get',vars);
}

Resource.prototype.head = function(vars){
  return this.request('head',vars);
}

Resource.prototype.post = function(vars){
  var args = [].slice.call(arguments,1) 
    , body = (this.write ? this.write.apply(this,args) : null)
  return this.request('post',vars,body);
}

Resource.prototype.put = function(vars){
  var args = [].slice.call(arguments,1) 
    , body = (this.write ? this.write.apply(this,args) : null)
  return this.request('put',vars,body);
}

Resource.prototype.delete = Resource.prototype.del = function(){
  return this.request('del');
}

Resource.prototype.patch = function(vars){
  var args = [].slice.call(arguments,1) 
    , body = (this.diff ? this.diff.apply(this,args) : null)
  return this.request('patch',vars,body);
}


Resource.prototype.end = function(fn){
  if (!this._request) return this;
  if (fn) fn = parserWrap(fn, this.read);
  this._request.end(fn);
  return this;
}

Resource.prototype.request = function(meth,vars,body){

  // path resolution
  var _vars = {};
  for (var v in vars) _vars[v] = vars[v];

  if (meth == 'del'){
    this._request = request[meth]( resolved(this.path,_vars) ); 
  } else {
    this._request = request[meth]( resolved(this.path,_vars), _vars ); 
  }

  if (body) this._request.send(body);
  if (this._headers) this._request.set(this._headers);
  if (this._type && (meth == 'get' || meth == 'head')) 
    this._request.set('Accept', this._type);

  return this;
}

// private

var isArray = Array.isArray || function (val) {
  return !! val && '[object Array]' == Object.prototype.toString.call(val);
};

function parserWrap(endFn, parseFn){
  return function(err,res){
    var obj = (parseFn ? parseFn(res.body) : res.body)
    endFn(err,obj,res);
  }
}

function resolved(path,vars){
  var ret = path.replace(/:(\w+)/g, function(_,key){ 
              if (has.call(vars,key)){
                var val = vars[key]; delete vars[key]
              } else {
                var val = key ;
              }
              return val;
            });
  return ret;
}


