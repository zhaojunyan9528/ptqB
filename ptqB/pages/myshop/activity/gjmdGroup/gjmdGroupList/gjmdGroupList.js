var http = require('../../../../../utils/http.js');
var unionid = wx.getStorageSync('thisCode');

const A = getApp();
Page(A.assignPage({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: http.imgUrl,
        statusList: [
            { id: '0', name: '全部状态' },
            { id: '1', name: '刮奖中' },
            { id: '2', name: '刮奖完成' }
        ],
        showStatusList: false, // 是否展开状态选择列表
        status: 0,

        num: 0, // 数量
        noList: false,
        noListData: {
          img: '/images/noGjmd.png',
          txt: '暂无刮奖信息'
        },
        pageNum: 0,
        pageSize: 0,
        pageCount: 0,
        isLastPage: false,
        list: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id || 0;
        this.setData({ id: id})
        this.getList(id, 0, 1)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      const _that = this, _d = _that.data;
      if(!_d.isLastPage){
        _that.getList(_d.id, _d.status, ++_d.pageNum)
      }
    },
    // 获取列表数据
    getList(id, type, pageNum){
      const _that = this, _d = _that.data;
      wx.showLoading({ title: '加载中' })
      A.updata.getGjmdGroupList(id, type, pageNum).then(res => {
        wx.hideLoading();
        if (res.status == A.STATE.STATUS.OK) {
          _that.setData({ num: res.total });
          if(res.all_paging == 0){
            _that.setData({ noList: true });
            return;
          }
          if(res.all_paging <= res.paging){
            _that.setData({ isLastPage: true });
          }
          let list = _d.list || [], newList = list;
          newList = newList.concat(res.list);
          this.setData({
            list: newList,
            pageCount: res.all_paging,
            pageNum: res.paging,
          })
        } else {
          A.showTipModal(res.info || '数据获取失败！');
        }
      }, err => {})
    },
    // 全部状态下拉
    showHide() {
      this.setData({ showStatusList: !this.data.showStatusList })
    },
    // 选择状态类型
    typeChecked(e) {
      let index = http.dataIndex(e)[0];
      this.setData({
        showStatusList: false,
        status: index,
        noList: false,
        pageNum: 0,
        pageCount: 0,
        isLastPage: false,
        list: [],
      })
      this.getList(this.data.id, index, 1)
    },
    // 到刮奖明细
    goGroupDetail: function(e){
      A.G('../gjmdGroupDetail/gjmdGroupDetail?id=' + e.currentTarget.dataset.id);
    }
}))