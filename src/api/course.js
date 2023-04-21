import request from '@/utils/request'

export default {
  //1 分页查询比赛的方法
  getPageListCourse(current, limit, courseQuery) {
    return request({
      url: `/ataiservice/atai-course/pageCourse/${current}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },
  //3 根据比赛id进行查询
  getCourseById(id) {
    return request({
      url: `/ataiservice/atai-course/getCourse/${id}`,
      method: 'get'
    })
  },
  // 4 添加比赛接口的方法
  addCourseInfo(courseInfo) {
    return request({
      url: `/ataiservice/atai-course/addCourse`,
      method: 'post',
      data: courseInfo
    })
  },
  // 5 修改比赛信息
  updateCourse(courseInfo) {
    return request({
      url: `/ataiservice/atai-course/updateCourse`,
      method: 'post',
      data: courseInfo
    })
  },
  // 5.删除比赛
  removeCourse(id) {
    return request({
      url: `/ataiservice/atai-course/course/${id}`,
      method: 'delete'
    })
  },

  //==============================================================================
  //===============================课程课时管理====================================
  //==============================================================================
  getCourseClass(courseId) {
    return request({
      url: `/ataiservice/atai-course/getCourseClass/${courseId}`,
      method: 'get'
    })
  },
  addCourseClass(courseClassInfo) {
    return request({
      url: `/ataiservice/atai-course/addCourseClass`,
      method: 'post',
      data: courseClassInfo
    })
  },
  updateCourseClass(courseClassInfo) {
    return request({
      url: `/ataiservice/atai-course/updateCourseClass`,
      method: 'post',
      data: courseClassInfo
    })
  },
  removeCourseClass(id) {
    return request({
      url: `/ataiservice/atai-course/class/${id}`,
      method: 'delete'
    })
  },
}
