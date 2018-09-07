# egg-qywx

企业微信API Egg 插件，日前只持 Egg2.x 以上版本

## 启用
```
// config/plugin.js

exports['qywx'] = {
  enable: true,
  package: 'egg-qywx',
};

```

## 配置说明
```
// config/config.default.js

config.qywx = {
    corpid: 'xxx', // 企业微信企业ID 必填
    secret: 'xxx', // 企业微信应用密钥 必填
    agentid: 'xxx', // 企业微信应用ID 必填
};

```

## 目前支持API

- 查询用户
