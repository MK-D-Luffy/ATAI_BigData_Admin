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
      <el-table-column
        label="性别"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.sex === 1 ? '女' : '男' }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="education" label="学历" align="center" width="140"/>
      <el-table-column :show-overflow-tooltip="true" prop="mobile" label="手机号" align="center" width="200"/>
      <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" align="center" width="200"/>

      <el-table-column :show-overflow-tooltip="true" prop="sign" label="签名" align="center"/>

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
      @current-change="getList"
    />
  </div>
</template>
<script>
// 引入调用competition.js文件
import competitionApi from '@/api/competition.js'

export default {
  // 写核心代码的位置
  data() {
    // 定义变量和初始值
    return {
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      users: [],
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList(page = 1) {
      this.page = page;
      competitionApi.getUserListPage(
        this.page,
        this.limit,
      ).then(response => {
        this.list = response.data.items
        this.total = response.data.total
      })
    },
    removeUserById(id) {
      // 删除比赛按钮的方法
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        competitionApi.removeUserById(id).then(response => {
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
      // 点取消执行catch方法  用户体验角度
      // 此处无需进行提示取消
      // 框架在./utils/request.js封装好了提示error的方法
    }
  }
}
</script>
