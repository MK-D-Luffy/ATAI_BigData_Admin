<template>
  <div class="app-container">
    <div
      style="line-height: 40px; font-weight: 700; font-size: 22px; color: #a85a11; margin-left: 10px;"
    >用户列表
    </div>
    <!-- 表格 -->
    <el-table :data="list" element-loading-text="数据加载中" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="nickname" label="名称" align="center" width="100"/>

      <el-table-column :show-overflow-tooltip="true" prop="mobile" label="手机号" align="center" width="200"/>
      <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" align="center" width="200"/>
      <el-table-column label="简历" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="getUserResumeById(scope.row.id)"
          >查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeUserById(scope.row.id)"
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
      @current-change="getUserList"
    />

    <el-dialog
      title="个人简历"
      :visible.sync="resumeVisible"
      append-to-body>
      <el-descriptions class="margin-top" :column="3" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ resume.name }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            年龄
          </template>
          {{ resume.age }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            性别
          </template>
          {{ resume.sex === 1 ? '男' : '女' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{resume.mobile}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            邮箱
          </template>
          {{resume.email}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            毕业院校
          </template>
          <el-tag size="small">{{resume.school}}</el-tag>
          <el-tag size="small">{{resume.education}}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            联系地址
          </template>
          {{resume.address}}
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            项目经历
          </template>
          {{resume.experience}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            荣誉奖项
          </template>
          {{resume.reward}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            专业技能
          </template>
          {{resume.skill}}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>
<script>
// 引入调用user.js文件
import userApi from '../../api/user.js'

export default {
  // 写核心代码的位置
  data() {
    // 定义变量和初始值
    return {
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      users: [],
      resume: {},
      resumeVisible: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList(page = 1) {
      this.page = page;
      userApi.getPageUserList(this.page, this.limit)
        .then(response => {
          this.list = response.data.items
          this.total = response.data.total
        })
    },

    getUserResumeById(userId) {
      this.resumeVisible = true
      userApi.getUserResumeById(userId)
        .then(response => {
          console.log(response.data)
          this.resume = response.data.resume
        })
    },
    removeUserById(id) {
      // 删除比赛按钮的方法
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.removeUserById(id).then(response => {
          // 删除成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除成功🤭'
          })
          // 回到列表页面
          this.getUserList()
        })
      })
    }
  }
}
</script>
