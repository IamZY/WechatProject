// pages/songDetail/songDetail.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否播放
    song:{},
    musicId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 接受option的传参
    // console.log(typeof options.song)
    // console.log(options)
    // console.log(JSON.parse(options.song))
    let musicId = options.musicId;

    this.setData({
      musicId
    })
    // console.log(musicId)

    this.getMusicInfo(musicId)

  },

  async getMusicInfo(musicId) {
    let songData = await request('/song/detail',{ids:musicId})
    this.setData({
      song:songData.songs[0]
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    let musicId = this.data.musicId
    this.musicControl(isPlay,musicId)
  },

  // 控制音乐播放暂停的功能函数
  async musicControl(isPlay,musicId) {
    let backgroundAudioManager = wx.getBackgroundAudioManager();

    if(isPlay) {
      // 音乐播放
      // 创建控制音乐播放实例对象

      let musicLinkData = await request('/song/url',{id:musicId}); 

      let musicLink = musicLinkData.data[0].url

      backgroundAudioManager.src = musicLink;
      backgroundAudioManager.title = this.data.song.name;
      backgroundAudioManager.play()
    } else {
      // 暂停音乐
      backgroundAudioManager.pause()
    }
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