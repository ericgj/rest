var request = require('superagent')
  , has = Object.hasOwnProperty 

module.exports = REST;

function REST(path,endpt){
  REST.endpoints = REST.endpoints || {};
  if (endpt) {
    REST.endpoints[path] = endpt
  } else {
    endpt = REST.endpoints[path] = (REST.endpoints[path] || {})
  }
  return endpt;
}

REST.headers = function(hdrs){
  this._headers = this._headers || {};
  for (var h in hdrs){
    this._headers[h] = hdrs[h];
  }
  return this;
}

REST.clearHeaders = function(){
  this._headers = {};
  return this;
}

REST.get = function(path,vars,fn){
  return this.send('get',path,vars,fn);
}

REST.head = function(path,vars,fn){
  return this.send('head',path,vars,fn);
}

REST.post = function(path,vars,fn){
  return this.send('post',path,vars,fn);
}

REST.put = function(path,vars,fn){
  return this.send('put',path,vars,fn);
}

REST.delete = REST.del = function(path,vars,fn){
  return this.send('del',path,vars,fn);
}

REST.patch = function(path,vars,fn){
  return this.send('patch',path,vars,fn);
}

REST.send = function(meth,path,vars,fn){
  if ('function' == typeof vars){
    fn = vars; vars = {};
  }
  if (fn) fn = wrap(fn, this.endpoints[path][meth]);
  var hdrs = this._headers || {};
  
  var _vars = {};
  for (var v in vars) _vars[v] = vars[v];

  if (meth == 'del'){
    return request.set(hdrs)[meth]( resolved(path,_vars), fn ); 
  } else {
    return request.set(hdrs)[meth]( resolved(path,_vars), _vars, fn ); 
  }
}

// private

function wrap(endFn, parseFn){
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


