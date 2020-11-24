// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, // 音乐是否播放
        song: {},
        musicId: '',
        musicLink: '',// 音乐链接
        currentTime:'00:00',
        durationTime:'00:00',
        currentWidth: 0, // 实时进度条的宽度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 接受option的传参
        // console.log(typeof options.song)
        // console.log(options)
        // console.log(JSON.parse(options.song))
        let musicId = options.musicId;

        this.setData({
            musicId
        })
        // console.log(musicId)

        this.getMusicInfo(musicId);

        /**
         * 如果用户操作系统的控制音乐播放 页面不知道 导致页面显示是狗播放的状态和真实的音乐播放不一致
         * 解决方案
         *  1、通过控制音频的实例监视播放音乐播放暂停 backgroundAudioManager
         */
        // 判断当前的页面阴郁的是否在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            // 修改当前页面的isPlay状态为true
            this.setData({
                isPlay: true
            })
        }

        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        this.backgroundAudioManager.onPlay(() => {
            // console.log('play...')
            // 修改音乐播放的状态
            this.changePlayState(true)
            // 修改全局音乐播放的状态
            // appInstance.globalData.isMusicPlay = true
            appInstance.globalData.musicId = musicId
        })

        this.backgroundAudioManager.onPause(() => {
            // console.log('pause...')
            this.changePlayState(false)
            // appInstance.globalData.isMusicPlay = false
        })

        this.backgroundAudioManager.onStop(() => {
            // console.log('pause...')
            this.changePlayState(false)
            // appInstance.globalData.isMusicPlay = false
        })


        // 监听音乐实时播放的进度
        this.backgroundAudioManager.onTimeUpdate(()=>{
            // console.log('总时长',this.backgroundAudioManager.duration)
            // console.log('当前时间',this.backgroundAudioManager.currentTime)
            // 格式化当前时间
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
            this.setData({
                currentTime,
                currentWidth
            })
        })

        // 监听音乐自然结束 切换至下一首音乐 并自动播放
        // 将实时的进度切换至0
        this.backgroundAudioManager.onEnded(()=>{
            PubSub.subscribe('switchType','next')
            // 还原实时进度条的长度
            this.setData({
                currentWidth: 0,
                currentTime: '00:00'
            })
        })


    },
    // 修改播放状态的功能函数
    changePlayState(isPlay) {
        // 修改音乐是否的状态
        this.setData({
            isPlay
        })
        appInstance.globalData.isMusicPlay = isPlay
    },

    async getMusicInfo(musicId) {
        let songData = await request('/song/detail', {ids: musicId})

        // 指定格式化
        let durationTime = moment(songData.songs[0].dt).format('mm:ss')

        this.setData({
            song: songData.songs[0],
            durationTime
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
        let {musicId, musicLink} = this.data
        this.musicControl(isPlay, musicId, musicLink)
    },

    // 控制音乐播放暂停的功能函数
    async musicControl(isPlay, musicId, musicLink) {
        // let backgroundAudioManager = wx.getBackgroundAudioManager();

        if (isPlay) {
            // 音乐播放
            if (!musicLink) {
                // 创建控制音乐播放实例对象
                let musicLinkData = await request('/song/url', {id: musicId});
                musicLink = musicLinkData.data[0].url

                this.setData({
                    musicLink
                })
            }


            this.backgroundAudioManager.src = musicLink;
            this.backgroundAudioManager.title = this.data.song.name;
            this.backgroundAudioManager.play()
        } else {
            // 暂停音乐
            this.backgroundAudioManager.pause()
        }
    },

    // 点击切歌的按钮
    handleSwitch(event) {
        let type = event.currentTarget.id;
        // console.log(type);
        // 关闭当时的音乐
        this.backgroundAudioManager.stop();
        PubSub.subscribe('musicId', (msg, musicId) => {
            console.log(musicId)

            // 获取音乐的详情信息
            this.getMusicInfo(musicId)
            // 如何自动播放当前的音乐
            this.musicControl(true, musicId);
            // 取消权限
            PubSub.unsubscribe('musicId')
        })

        // 发布消息数据给recommendSong页面
        PubSub.publish('switchType', type)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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