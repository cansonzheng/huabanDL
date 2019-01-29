const request=require('request');

module.exports=(url,cookie)=>{
  return new Promise((resolve,reject)=>{
    request({
      url,
      method:'GET',
      headers:{     
        "Cookie":cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3578.98 Safari/537.36",
        "Accept": "application/json",
        "X-Request": "JSON",
        "X-Requested-With": "XMLHttpRequest"
      }
    },(err,res,body)=>{
      if(err){
        reject(err);
        return;
      }
      try{
        body=JSON.parse(body);
        resolve(body);
      }catch(e){
        reject(err);
      }
    });
  })
}