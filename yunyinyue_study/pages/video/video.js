// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: 0,
    videoList: [],
    videoId: '', // 视频id标识
    videoUpdateTime: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getVideoGroupListData()
    // console.log(this.data.navId)
  },

  // 获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })

    this.getVideoList(this.data.navId)
  },

  // 获取视频列表数据
  async getVideoList(navId) {
    if (!navId) {
      return;
    }
    let videoListData = await request('/video/group', {
      id: navId
    })
    // console.log(videoListData)

    wx.hideLoading()

    let index = 0

    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    })

    this.setData({
      videoList
    })

    // console.log(this.data.videoList)

  },

  // 点击切换视频列表数据
  changeNav(event) {
    let navId = event.currentTarget.id
    this.setData({
      navId: navId * 1,
      videoList: []
    })
    // console.log(event)

    wx.showLoading({
      title: '正在加载',
    })

    this.getVideoList(this.data.navId)

    // wx.hideLoading()
  },

  handlePlay(event) {
    console.log('play')
    /**
     * 多个视频同时播放的问题
     * 无法关闭本视频
     */
    // console.log(event)
    // 再点击视频的时候需要查找上个播放的视频
    // 关闭掉上次播放的视频
    
    // 点击当前视频的id
    let vid = event.currentTarget.id;
    // 如何找到上一个视频的对象
    // 单例模式 需要创建多个对象的场景下 通过一个变量接受 始终保持只有一个对象 节省内存空间

    // 如何确认点击播放的视频和正在播放的视频不是同一个视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid;

    // 更新data中videoId中的状态数据
    this.setData({
      videoId: vid
    })

    this.videoContext = wx.createVideoContext(vid)
    this.videoContext.play();
    
    // this.videoContext.stop()

  },

  handleTimeUpdate(event) {
    // console.log(event)
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