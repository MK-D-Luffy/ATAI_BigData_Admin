import request from '@/utils/request'

export default {
  //1 分页查询比赛的方法
  getPageListCompetition(current, limit, competitionQuery) {
    return request({
      url: `/ataiservice/atai-competition/pageCompetitionCondition/${current}/${limit}`,
      method: 'post',
      data: competitionQuery
    })
  },
  //2 查询大型比赛
  getLargeCompetition() {
    return request({
      url: `/ataiservice/atai-competition/getLargeCompetition`,
      method: 'get'
    })
  },
  //3 根据比赛id进行查询
  getCompetitionById(id) {
    return request({
      url: `/ataiservice/atai-competition/getCompetition/${id}`,
      method: 'get'
    })
  },
  // 4 添加比赛接口的方法
  addCompetitionInfo(competitionInfo) {
    return request({
      url: `/ataiservice/atai-competition/addCompetition`,
      method: 'post',
      data: competitionInfo
    })
  },
  // 5 修改比赛信息
  updateCompetition(competitionInfo) {
    return request({
      url: `/ataiservice/atai-competition/updateCompetition`,
      method: 'post',
      data: competitionInfo
    })
  },
  // 5.删除比赛
  removeCompetition(id) {
    return request({
      url: `/ataiservice/atai-competition/${id}`,
      method: 'delete'
    })
  },

  //==============================================================================
  //=================================团队管理====================================
  //==============================================================================
  getRankList(competitionId) {
    return request({
      url: `/ataiservice/atai-competition/getRankList/${competitionId}`,
      method: 'get'
    })
  },
  getTeamUsers(teamId) {
    return request({
      url: `/ataiservice/atai-competition/getTeamUsers/${teamId}`,
      method: 'get'
    })
  },
  getCompetitionRecord(competitionId,teamId) {
    return request({
      url: `/ataiservice/atai-competition/getRecordByTeamId/${competitionId}/${teamId}`,
      method: 'get'
    })
  },
  // 7.查询所有用户
  getUserListPage(current, limit) {
    return request({
      url: `/eduucenter/ucenter-member/getUserListPage/${current}/${limit}`,
      method: 'post',
    })
  },

  removeUserById(id) {
    return request({
      url: `/eduucenter/ucenter-member/${id}`,
      method: 'delete',
    })
  }
}
