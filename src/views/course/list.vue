<template>
  <div class="app-container">
    <div
      style="line-height: 40px; font-weight: 700; font-size: 22px; color: #a85a11; margin-left: 10px;margin-bottom: 20px">
      课程列表
    </div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.name" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.level" clearable placeholder="课程类型">
          <el-option value="入门" label="入门"/>
          <el-option value="进阶" label="进阶"/>
          <el-option value="实战" label="实战"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="courseQuery.timeStatus" clearable placeholder="课程状态">
          <el-option value="进行中" label="进行中"/>
          <el-option value="即将开始" label="即将开始"/>
          <el-option value="已经结束" label="已经结束"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="courses" element-loading-text="数据加载中" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" align="center" width="180"/>
      <el-table-column :show-overflow-tooltip="true" prop="intro" label="摘要" align="left"/>
      <el-table-column :show-overflow-tooltip="true" prop="level" label="比赛类型" align="center" width="80">
        <template slot-scope="scope">
          <el-button type="success" size="mini">{{ scope.row.level }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="participants" label="参加人数" align="center" width="80"/>
      <el-table-column
        :show-overflow-tooltip="true"
        label="开课时间"
        align="center"
        width="260">
        <template slot-scope="scope">
          {{ scope.row.begin.substring(0, 16) }} - {{ scope.row.end.substring(0, 16) }}
        </template>
      </el-table-column>
      <!--      <el-table-column :show-overflow-tooltip="true" label="排行榜" width="100">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button type="danger" plain size="mini" @click="getRankList(scope.row.id)">排行榜</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>
<script>
// 引入调用course.js文件
import courseApi from '@/api/course.js'

export default {
  // 写核心代码的位置
  data() {
    // 定义变量和初始值
    return {
      courses: [], // 查询之后接口返回集合
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      courseQuery: {}, // 条件封装的对象 v-model双向绑定
      isLarge: 0,
      rankVisible: false,
      rankList: [],
      rankInnerVisible1: false,
      teamUsers: [],
      rankInnerVisible2: false,
      courseRecords: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 创建具体的方法，调用course.js定义的方法
    getList(page = 1) {
      this.isLarge = 0
      this.page = page
      courseApi
        .getPageListCourse(
          this.page,
          this.limit,
          this.courseQuery
        )
        .then(response => {
          this.courses = response.data.items
          this.total = response.data.total
        })
        .catch(error => {
          // 请求失败
          console.log(error)
        })
    },

    getTeamUsers(teamId) {
      this.rankInnerVisible1 = true
      courseApi
        .getTeamUsers(teamId)
        .then(response => {
          console.log(response.data)
          this.teamUsers = response.data.users
        })
        .catch(error => {
          // 请求失败
          console.log(error)
        })
    },
    resetData() {
      // 清空按钮的方法
      // 清空已输入数据
      this.courseQuery = {}
      // 查询所有  恢复未进行条件查询的状态
      this.getList()
    },
    removeDataById(id) {
      // 删除比赛按钮的方法
      this.$confirm('此操作将永久删除比赛信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseApi.removeCourse(id).then(response => {
          // 删除成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除成功🤭'
          })
          // 回到列表页面
          this.getList()
        })
      })
      // 点取消执行catch方法  用户体验角度
      // 此处无需进行提示取消
      // 框架在./utils/request.js封装好了提示error的方法
    }
  }
}
</script>

<!-- <style>
  .el-form-item__label {
    color: #a85a11
  }

  .el-table {
    color: #a85a11;
  }

  .el-table__placeholder {
    color: orange !important;
  }

  .el-input__inner {
    border: 1px solid #a85a11;
    border-radius: 0px;
    background-color: #f9d98e;
    color: #a85a11;
  }

</style> -->
