// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: "初始化的数据",
    userInfo:{}
  },
  handleParent(){
    console.log('parent')
  },
  handleChild(){
    console.log('child')
  },
  toLogs(){
    wx.redirectTo({
      url: '/pages/logs/logs',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload()')
    // console.log(this)

    // setTimeout(()=>{
    //   this.setData({
    //     msg: "修改之后的数据"
    //   })
    //   console.log(this.data.msg)
    // },2000)

    // 授权以后获取用户信息
    wx.getUserInfo({
      success:(res)=>{
        console.log(res)
        this.setData({
          userInfo: res.userInfo
        })
      },
      fail:(err)=>{
        console.log(err)
      }
    })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady()')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow()')
  },

  handleUserInfo(res){
    console.log(res)
    if(res.detail.userInfo) {
      this.setData({
        userInfo: res.detail.userInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})