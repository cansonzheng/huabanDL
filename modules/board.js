const fs=require('fs');
const get=require('./get');
const db=require('./db');
const config=require('../config');

// 当前用户
let user;

const o={
  // 获取画板列表
  getlist:()=>{
    let zurl='http://login.meiwu.co/'+user.urlname;
    let arr=[];
    let pm=new Promise((resolve,reject)=>{
      function load(url){
        get(url,user.cookie)
        .then(data=>{
          if(data.layout===false){
            console.log('获取失败，正在重试...');
            load(url);
            return;
          }
          let max='';
          data.user.boards.forEach(v=>{
            arr.push(v.board_id);
            max=v.board_id;
          });
          if(arr.length<=data.user.board_count) load(zurl+`?&max=${max}`);
          else{
            console.log('画板获取完成！');
            resolve(arr)
          }
        }).catch(err=>{
          console.log('画板获取失败，请重试！');
          reject(err);
        });
      }
      load(zurl);
    });
    return pm;
  },
  // 解析画板信息
  parse:()=>{
    user=db.get('users').find({account:config.account}).value();
    return new Promise(async (resolve,reject)=>{
      console.log('正在获取画板...');
      let board=[];
      if(!config.board||!config.board.length){
        try{
          board=await o.getlist();
          console.log('正在解析画板...');
        }catch(e){
          reject(e)
        }
      }else{
        board=config.board;
        board=board.map(v=>v.replace(/[^\d]/g,''));
      }
      let piclist=[];
      let i=board.length;
      board.forEach(v=>{
        o.getpic(v).then(res=>{
          piclist=piclist.concat(res);
          i--;
          if(!i){
            resolve({
              board:{count:board.length},
              piclist
            });
          }
        })
      });
    })
  },
  // 获取图片地址
  getpic:id=>{
    const zurl=`http://login.meiwu.co/boards/${id}`;
    let arr=[];
    let pm=new Promise((resolve,reject)=>{
      function load(url){
        get(url,user.cookie)
        .then(data=>{
          if(data.layout===false){
            console.log('获取失败，正在重试...');
            load(url);
            return;
          }
          let max='';
          data.board.title=data.board.title.trim().replace(/[\\\/\:\*\?\"\<\>\|\'\n\u200b]/g,'').substring(0,20);
          fs.mkdir(`./download/${user.urlname}/${data.board.title}`,err=>false);
          data.board.pins.forEach(v=>{
            arr.push({
              id:v.pin_id,
              name:v.raw_text.trim(),
              url:`http://img.hb.meiwu.co/${v.file.key}`,
              type:v.file.type,
              path:`./download/${user.urlname}/${data.board.title}`
            });
            max=v.pin_id;
          });

          if(arr.length<data.board.pin_count) load(zurl+`?&max=${max}`);
          else{
            resolve(arr)
          }
        }).catch(err=>{
          reject(err);
        });
      }
      load(zurl);
    });
    return pm;
  }
}
module.exports=o;