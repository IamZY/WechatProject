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
            url: config.mobileHost + url,
            data,
            method,
            success(res) {
                console.log('请求成功', res)
                resolve(res.data);
            },
            fail(res) {
                console.log('请求失败', res)
                reject(res);
            }
        })
    })


}