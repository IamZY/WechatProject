// pages/personal/personal.js
import request from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    converTransform: 'translateY(0)',
    coveTransition: '',
    userInfo: {},
    recentPlayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 本地存储 建议本地存储的数据格式为json
    let userInfo = wx.getStorageSync('userInfo')
    // console.log(userInfo)
    if(userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      // console.log(JSON.parse(userInfo).userId)
      // 获取用户播放记录
      this.getUserRecentPlayList(JSON.parse(userInfo).userId)

    }
  },

  // 获取用户播放记录
  async getUserRecentPlayList(userId){
    let recentPlayListData = await request('/user/record',{uid:userId,type:0})
    let index = 0
    let recentPlayList = recentPlayListData.allData.splice(0, 10).map((item)=>{
      item.id = index++;
      return item
    })
    this.setData({
      // 同名可以简写
      recentPlayList: recentPlayList
    })
  },

  // 跳转至登录界面
  toLogin() {
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },

  bindTouchStart(event) {
    this.setData({
      coveTransition: ''
    })
    // 获取手指的起始坐标
    startY = event.touches[0].clientY;
  },
  bindTouchMove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;

    if(moveDistance <= 0) {
      return;
    }

    if(moveDistance >= 80) {
      moveDistance = 80
    }

    this.setData({
      converTransform: `translateY(${moveDistance}rpx)`
    })
  },
  bindTouchEnd() {
    this.setData({
      converTransform: `translateY(0rpx)`,
      coveTransition: 'transform 1s linear'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})