const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");
const logger = morgan("tiny");
const axios = require('axios');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  const CLOUD_FUNCTION_URL = 'https://122.51.155.47';

  try {
    const response = await axios.post(CLOUD_FUNCTION_URL, {
      data: { key: "value" }, // 传递给云函数的参数
    });
    console.log("云函数返回:", response.data);
  } catch (error) {
    console.error("调用云函数失败:", error.response?.data || error.message);
  }

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
  try {
    const reuslt = await cloud.callFunction({name:'TTLockCallback',data:res});
  res.send({
    code:0,
    data:reuslt
  })
  } catch (error) {
    console.log('yangqin error==>',error);
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
