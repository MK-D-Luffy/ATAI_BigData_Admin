import request from '@/utils/request'

export default {
  //1 分页查询比赛的方法
  getPageListDataset(current, limit, datasetQuery) {
    return request({
      url: `/ataiservice/atai-dataset/pageDataset/${current}/${limit}`,
      method: 'post',
      data: datasetQuery
    })
  },
  //3 根据比赛id进行查询
  getDatasetById(id) {
    return request({
      url: `/ataiservice/atai-dataset/getDataset/${id}`,
      method: 'get'
    })
  },
  // 4 添加比赛接口的方法
  addDatasetInfo(datasetInfo) {
    return request({
      url: `/ataiservice/atai-dataset/addDataset`,
      method: 'post',
      data: datasetInfo
    })
  },
  // 5 修改比赛信息
  updateDataset(datasetInfo) {
    return request({
      url: `/ataiservice/atai-dataset/updateDataset`,
      method: 'post',
      data: datasetInfo
    })
  },
  // 5.删除比赛
  removeDataset(id) {
    return request({
      url: `/ataiservice/atai-dataset/dataset/${id}`,
      method: 'delete'
    })
  },

  //==============================================================================
  //===============================课程课时管理====================================
  //==============================================================================
  getDatasetClass(datasetId) {
    return request({
      url: `/ataiservice/atai-dataset/getDatasetClass/${datasetId}`,
      method: 'get'
    })
  },
}
