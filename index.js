const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");
const logger = morgan("tiny");
const axios = require('axios');
const cloud = require('wx-server-sdk');
const ENV = 'yq-release-5gaejr2bafeb56eb';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {

  let URL = `https://api.weixin.qq.com/tcb/invokecloudfunction?env=${ENV}&name=getBanner`;
  console.log('=======URL====>',URL);
  try {
    const response = await axios.post(URL);
    res.send({
      code: 0,
      data: {title:'hellow yangqin',data:response.data},
    });
  
    console.log('=====response====>',response);
  } catch (error) {
    console.log('======error==>',error);
  }
 
});
/**
 * 通通锁的回调地址
 * 因为通通锁只能一次性配置，但是微信的开放接口invokecloudfunction又需要token，而token时效只有2小时，所以只能通过云托管来免token请求
 */
app.post("/",async(req,res)=>{
  console.log('===req==>',req);
  let URL = `https://api.weixin.qq.com/tcb/invokecloudfunction?env=${ENV}&name=TTLockCallback`;
  try {
    axios.post(URL,{data:req.body.records}).then(res=>{
      console.log('===ttlockcallfunction==>',res);
    }).catch(err=>{
      throw err;
    });
    res.send({
      code: 0,
      data: 'success',
    });
  } catch (error) {
    console.log('======error==>',error);
  }
})

//下面都是模版的内容 可以参考学习
// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
