<template>
  <div class="app-container">
    <div
      style="line-height: 40px; font-weight: 700; font-size: 22px; color: #a85a11; margin-left: 10px;margin-bottom: 20px">
      比赛列表
    </div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="datasetQuery.name" placeholder="比赛名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="datasetQuery.category" clearable placeholder="比赛类型">
          <el-option value="官方赛" label="官方赛"/>
          <el-option value="训练赛" label="训练赛"/>
          <el-option value="个人赛" label="个人赛"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="datasets" element-loading-text="数据加载中" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" align="center" width="180"/>
      <el-table-column :show-overflow-tooltip="true" prop="intro" label="摘要"/>

      <el-table-column :show-overflow-tooltip="true" prop="category" label="比赛类型" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="success" size="mini">{{ scope.row.category }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="watch" label="浏览量" align="center" width="100"/>
      <el-table-column prop="download" label="下载量" align="center" width="100"/>
      <!--      <el-table-column :show-overflow-tooltip="true" prop="result" label="结果集数据路径"/>-->
      <!--      <el-table-column :show-overflow-tooltip="true" prop="data" label="赛题数据路径"/>-->
<!--      <el-table-column-->
<!--        :show-overflow-tooltip="true"-->
<!--        prop="deadline"-->
<!--        label="截止日期"-->
<!--        width="160"-->
<!--      />-->
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/dataset/edit/'+scope.row.id">
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
// 引入调用dataset.js文件
import datasetApi from '@/api/dataset.js'

export default {
  // 写核心代码的位置
  data() {
    // 定义变量和初始值
    return {
      datasets: [], // 查询之后接口返回集合
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      datasetQuery: {}, // 条件封装的对象 v-model双向绑定
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 创建具体的方法，调用dataset.js定义的方法
    getList(page = 1) {
      this.isLarge = 0
      this.page = page
      datasetApi
        .getPageListDataset(
          this.page,
          this.limit,
          this.datasetQuery
        )
        .then(response => {
          this.datasets = response.data.items
          this.total = response.data.total
        })
        .catch(error => {
          // 请求失败
          console.log(error)
        })
    },
    resetData() {
      // 清空按钮的方法
      // 清空已输入数据
      this.datasetQuery = {}
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
        datasetApi.removeDataset(id).then(response => {
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

 <style>
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

</style>
