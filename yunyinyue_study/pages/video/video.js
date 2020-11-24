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
    videoUpdateTime: [], // 记录video的时长
    isTriggered: false
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
      videoList,
      // 关闭下拉刷新
      isTriggered: false
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

    // 判断当前视频是否播放过
    let {
      videoUpdateTime
    } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)

    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }

    this.videoContext.play();

    // this.videoContext.stop()

  },

  handleTimeUpdate(event) {
    // console.log(event)
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    };

    let {
      videoUpdateTime
    } = this.data

    // 判断播放时长的数组中是否有当前视频的播放记录
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)

    if (videoItem) {
      // 获取最新的时长
      videoItem.currentTime = videoTimeObj.currentTime;
    } else {
      // 之前没有
      videoUpdateTime.push(videoTimeObj)
    }

    // 统一更新videoUpdate状态
    this.setData({
      videoUpdateTime
    })

  },

  /** 移除的时候删除  */
  handleEnded(event) {
    // 移除记录播放时长 当前视频对象
    let {
      videoUpdateTime
    } = this.data
    let vid = event.currentTarget.id;
    let id = videoUpdateTime.findIndex(item => item.vid === vid)
    videoUpdateTime.splice(id, 1)
    this.setData({
      videoUpdateTime
    })
  },
  handleRefresher() {
    console.log('refresher')
    // 再次发送请求获取最新的视频列表数据
    this.getVideoList(this.data.navId)

  },

  // 自定义上拉触底回调
  handleToLower() {
    // console.log('scroll 上拉触底')
    // 数据分页

  },

  toSearch() {
    wx.navigateTo({
      url:'/pages/search/search'
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
    console.log('下拉')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('上拉')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(from) {
    console.log(from)
    if (from === 'button') {
      return {
        title: 'button转发内容',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    } else {
      return {
        title: 'menu转发内容',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }

  }
})