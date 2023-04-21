import request from '@/utils/request'

export default {
  //1 分页查询比赛的方法
  getPageUserList(current, limit) {
    return request({
      url: `/ataiucenter/ucenter/getUserListPage/${current}/${limit}`,
      method: 'post',
    })
  },
  getUserResumeById(userId) {
    return request({
      url: `/ataiucenter/ucenter/getUserResume/${userId}`,
      method: 'get',
    })
  },
  // 5.删除比赛
  removeUserById(id) {
    return request({
      url: `/ataiucenter/ucenter/${id}`,
      method: 'delete'
    })
  },
}
