import request from '@/utils/request'
export default {
  //1 生成统计数据
  createStaData(day) {
    return request({
      url: `/edusta/statistics/registerCount/${day}`,
      method: 'post'
    })
  },
  //2 获取统计数据
  getStaData(searchObj) {
    return request({
      url: `/edusta/statistics/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  },
  //3 GET 各类比赛参赛人数-赛事数 /edusta/statistics/compCnumAndPnum
  compCnumAndPnum() {
    return request({
      url: `/edusta/statistics/compCnumAndPnum/`,
      method: 'get'
    })
  },
  //4 GET /edusta/statistics/articleSta 文章根据分类对点击量与评论数的统计
  articleSta() {
    return request({
      url: `/edusta/statistics/articleSta/`,
      method: 'get'
    })
  },
}
