const Service = require('egg').Service;

class QywxApiService extends Service {

  async getAccessToken() {

    if(!this.app.config.qywx){
      this.app.coreLogger.error(new Error(`[egg-qywx][getAccessToken] No configuration found`));
      return;
    }

    const {corpid, secret} = this.app.config.qywx;

    if(!corpid || !secret){
      this.app.coreLogger.error(new Error(`[egg-qywx][getAccessToken] corpid or secret cannot be empty`));
      return;
    }

    if(!this.app.qywx.accessTokenInfo || (this.app.qywx.accessTokenInfo && (Date.now() - this.app.qywx.accessTokenInfo.getTime) > this.app.qywx.accessTokenInfo.expiresIn * 1000)){

      this.app.coreLogger.info(`[egg-qywx][getAccessToken] start`);

      const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${secret}`, {
        dataType: 'json',
      });

      if(result.data.errcode){
        this.app.coreLogger.error(new Error(`[egg-qywx][getAccessToken] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
        return;
      }

      this.app.qywx.accessTokenInfo = {
        accessToken: result.data.access_token,
        expiresIn: result.data.expires_in,
        getTime: Date.now(),
      };
    }

    return this.app.qywx.accessTokenInfo.accessToken;

  }

  async getUserId(code) {
    if(!code){
      this.app.coreLogger.info(new Error(`[egg-qywx][getUserId] code cannot be empty`));
      return;
    }
    const accessToken = await this.getAccessToken();
    if(!accessToken){
      return;
    }
    const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${accessToken}&code=${code}`, {
      dataType: 'json',
    });

    if(result.data.errcode){
      this.app.coreLogger.error(new Error(`[egg-qywx][getUserId] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
      return;
    }

    return result.data;

  }

  async getUserInfo(userId) {
    if(!userId){
      this.app.coreLogger.info(new Error(`[egg-qywx][getUserInfo] userId cannot be empty`));
      return;
    }
    const accessToken = await this.getAccessToken();
    if(!accessToken){
      return;
    }
    const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}&userid=${userId}`, {
      dataType: 'json',
    });

    if(result.data.errcode){
      this.app.coreLogger.error(new Error(`[egg-qywx][getUserInfo] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
      return;
    }

    return result.data;

  }

  async getDepartmentList(id) {
    if(!id){
      this.app.coreLogger.info(new Error(`[egg-qywx][getDepartmentList] id cannot be empty`));
      return;
    }
    const accessToken = await this.getAccessToken();
    if(!accessToken){
      return;
    }
    const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${accessToken}&id=${id}`, {
      dataType: 'json',
    });

    if(result.data.errcode){
      this.app.coreLogger.error(new Error(`[egg-qywx][getDepartmentList] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
      return;
    }

    return result.data;

  }

  async getAllDepartmentList() {

    const accessToken = await this.getAccessToken();
    if(!accessToken){
      return;
    }
    const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${accessToken}`, {
      dataType: 'json',
    });

    if(result.data.errcode){
      this.app.coreLogger.error(new Error(`[egg-qywx][getAllDepartmentList] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
      return;
    }

    return result.data;

  }
}

module.exports = QywxApiService;
