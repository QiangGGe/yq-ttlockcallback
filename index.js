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
 

 
  // var c1 = new cloud.Cloud({
  //   resourceAppid: 'wx43041853dcd2e2de',
  //   resourceEnv: 'yq-release-5gaejr2bafeb56eb',
  // });
  // await c1.init();
  // return await c1.callFunction({
  //   name: 'getBanner',
  //   data: {}, // 从外部传入的数据
  // });
  // const CLOUD_FUNCTION_URL = 'https://122.51.155.47';

  // try {
  //   const response = await axios.post(CLOUD_FUNCTION_URL, {
  //     data: { key: "value" }, // 传递给云函数的参数
  //   });
  //   console.log("云函数返回:", response.data);
  // } catch (error) {
  //   console.error("调用云函数失败:", error.response?.data || error.message);
  // }

  // try {

  //   const result = await cloud.callFunction({name:'getBanner',data:{}})
  // res.send({
  //   code: 0,
  //   data: {title:'hellow yangqin',result},
  // });
  // } catch (error) {
  //   console.log('yangqin error==>',error);
  // }
 
});

app.post("/",async(req,res)=>{
  console.log('====req==>',req);
  console.log('====res==>',res);



  res.send({
    code: 0,
    data: {title:'hellow yangqin'},
  });
  // try {
  //   const reuslt = await cloud.callFunction({name:'TTLockCallback',data:res});
  // res.send({
  //   code:0,
  //   data:reuslt
  // })
  // } catch (error) {
  //   console.log('yangqin error==>',error);
  // }
  
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
