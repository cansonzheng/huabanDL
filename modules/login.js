const request=require('request');
const db=require('./db');
const config=require('../config');

module.exports=()=>{
  return new Promise((resolve,reject)=>{
    let now=new Date().getTime();
    let user=db.get('users').find({account:config.account}).value();
    // 如果未过期
    if(user&&user.expires>now){
      resolve(user);
      return;
    }
    request({
      url:'http://login.meiwu.co/auth/',
      method:'POST',
      headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        'X-Request': 'JSON',
        'X-Requested-With': 'XMLHttpRequest'
      },
      form:{
        email:config.account,
        password:config.pwd,
        _ref:'loginPage'
      }
    },(err,res,body)=>{
      body=JSON.parse(body);
      try{
        let data={
          account:config.account,
          urlname:body.user.urlname,
          cookie:res.headers['set-cookie'],
          expires:now+1000*60*60*24*20 //20天过期
        }
        if(user){
          let $user=db.get('users').find({account:config.account});
          for(n in data){
            $user.set(n,data[n]);
          }
          $user.write();
        }else{
          db.get('users').push(data).write();
        }
        resolve(data);
      }catch(e){
        reject(e);
      }
    })
  })
}
