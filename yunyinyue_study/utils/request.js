// 发送ajax请求

/*

封装功能函数
功能点明确
函数内部应该保留固定代码
将动态的数据抽取成形参 使用这根据自身的情况动态的传入实参

* */
import config from './config'

export default (url, data = {}, method = 'GET') => {

    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            data,
            method,
            header:{
              cookie: wx.getStorageSync('cookies')
            },
            success(res) {
                console.log('请求成功', res)
                // cookie
                // 将cookie保存在本地
                // 判断请求来源
                if(data.isLogin) {
                  // 
                  console.log(res)
                  console.log(res.cookies)

                  console.log(typeof(res.cookies))

                  console.log(res.cookies.find(item => item.indexOf('MUSIC_U') !== -1))

                  // console.log(value)

                  wx.setStorage({
                    key: 'cookies',
                    // data: res.cookies,
                    data:res.cookies.find(item => item.indexOf('MUSIC_U') !== -1)
                  })
                }
                
                resolve(res.data);
            },
            fail(res) {
                console.log('请求失败', res)
                reject(res);
            }
        })
    })


}