const login=require('./modules/login');
const board=require('./modules/board');
const download=require('./modules/download');
const fs=require('fs');

// 启动
async function start(){
  fs.mkdir('./download/',err=>false);
  try{
    let u=await login();
    fs.mkdir('./download/'+u.urlname,err=>false);
  }catch(e){
    console.log('登录失败');
    return;
  }

  let bp=await board.parse();
  let piclist=bp.piclist;
  console.log(`${bp.board.count}个画板，共${piclist.length}张图片，开始下载...`);
  let cur=0;
  let retrylist=[];
  let dl=()=>{
    download(piclist[cur],v=>{
      if(v.err){
        console.log(`[${cur+1}/${piclist.length}] 下载失败 ${v.url}`);
        retrylist.push(v);
      }else{
        console.log(`[${cur+1}/${piclist.length}] 已下载 ${v.url}`);
      }
      cur++;
      if(piclist[cur]) dl();
      else{
        if(!retrylist.length) return;
        console.log(`失败${retrylist.length}个，正在重新下载...`);
        cur=0;
        piclist=retrylist.map(v=>{
          delete v.err;
          return v;
        });
        retrylist=[];
        dl();
      }
    });
  }
  dl();
}

start();
