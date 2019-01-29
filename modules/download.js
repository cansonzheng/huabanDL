const fs=require('fs');
const request=require('request');

module.exports=(v,cb)=>{
  let extname='.jpg';
  switch(v.type){
    case 'image/png':
    extname='.png';break;
    case 'image/gif':
    extname='.gif';break;
  }
  let writeStream= fs.createWriteStream(`${v.path}/${v.name.replace(/[\\\/\:\*\?\"\<\>\|\'\n\u200b]/g,'').substring(0,20)}_${v.id}${extname}`);
  let readStream = request(v.url,{timeout:10000});
  readStream.pipe(writeStream);
  readStream.on('end', function() {
  });
  readStream.on('error', function(err) {
    v.err=true;
    cb(v);
  })
  writeStream.on("finish", function() {
    writeStream.end();
    cb(v);
  });
}