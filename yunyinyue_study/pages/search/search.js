// pages/search/search.js
import request from '../../utils/request'

let isSend = false; // 函数节流使用
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent: '', // placeholder内容
        hotList: [],
        searchContent: '', // 用户输入的表单化数据
        searchList: [],  // 关键字模糊匹配的数据
        historyList: [], // 搜索历史记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInitData()

        // 获取历史记录
        this.getSearchHistory()
    },
    async getInitData() {
        let placeholderData = await request('/search/default')
        let hostListData = await request('/search/hot/detail')
        this.setData({
            placeholderContent: placeholderData.data.showKeyword,
            hotList: hostListData.data
        })
    },

    handleInputChange(event) {
        // console.log(event)
        //t
        this.setData({
            searchContent: event.detail.value.trim()
        })

        if (isSend) {
            return
        }
        isSend = true

        // 函数节流 防抖
        //
        // this.isSend = false
        // 发请求 获取关键字模糊匹配数据
        this.getSearchList();
        setTimeout(() => {
            isSend = false
        }, 300)

    },

    // 获取搜索数据的功能函数
    async getSearchList() {
        if (!this.data.searchContent) {
            this.setData({
                searchList: [],
            })
            return;
        }

        let {searchContent, historyList} = this.data

        let searchListData = await request('/search', {keywords: searchContent, limit: 10})
        this.setData({
            searchList: searchListData.result.songs
        })

        // 有没有即将添加的内容
        if (historyList.indexOf(searchContent) !== -1) {
            historyList.splice(historyList.indexOf(searchContent), 1)
        }
        historyList.unshift(searchContent)
        this.setData({
            historyList
        })

        wx.setStorageSync('searchHistory', historyList)

    },

    // 获取本地搜索记录
    getSearchHistory() {
        let historyList = wx.getStorageSync('searchHistory')
        if (historyList) {
            this.setData({
                historyList
            })
        }

    },

    // 清空搜索内容
    clearSearchContent() {
        console.log('clear()')
        this.setData({
            searchContent: '',
            searchList: [],
        })
    },

    deleteSearchHistory() {
        wx.showModal({
            content: '确认删除吗?',
            success: (res) => {
                // console.log(res)
                if (res.confirm) {
                    // 清空data中historyList
                    this.setData({
                        historyList: [],
                    })
                    // 移除本地历史记录缓存
                    wx.removeStorageSync('searchHistory')
                }
            }
        })

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