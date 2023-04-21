<template>
  <div class="app-container">
    <div
      style="line-height: 40px; font-weight: 700; font-size: 22px; color: #a85a11; margin-left: 10px;margin-bottom: 20px">
      比赛列表
    </div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="competitionQuery.name" placeholder="比赛名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="competitionQuery.level" clearable placeholder="比赛类型">
          <el-option value="官方赛" label="官方赛"/>
          <el-option value="训练赛" label="训练赛"/>
          <el-option value="个人赛" label="个人赛"/>
        </el-select>
      </el-form-item>
      <el-button v-if="isLarge===0" type="success" icon="el-icon-search" @click="getLargeList()">查看大型赛事</el-button>
      <el-button v-else type="success" icon="el-icon-search" @click="getList()">查看一般赛事</el-button>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="competitions" element-loading-text="数据加载中" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" width="180"/>
      <el-table-column :show-overflow-tooltip="true" prop="intro" label="摘要"/>

      <el-table-column :show-overflow-tooltip="true" prop="level" label="比赛类型" width="80">
        <template slot-scope="scope">
          <el-button type="success" size="mini">{{ scope.row.level }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="participants" label="参加人数" width="80"/>
      <el-table-column prop="money" label="奖金" width="70"/>
      <!--      <el-table-column :show-overflow-tooltip="true" prop="result" label="结果集数据路径"/>-->
      <!--      <el-table-column :show-overflow-tooltip="true" prop="data" label="赛题数据路径"/>-->
      <el-table-column
        :show-overflow-tooltip="true"
        prop="deadline"
        label="截止日期"
        width="160"
      />
      <el-table-column :show-overflow-tooltip="true" label="排行榜" width="100">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" @click="getRankList(scope.row.id)">排行榜</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/comp/edit/'+scope.row.id">
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

    <el-dialog title="排行榜" :visible.sync="rankVisible">
      <el-table
        ref="singleTable"
        :data="rankList"
        border
        header-row-class-name="tableHead"
        row-class-name="tableRow"
        style="width: 100%;">
        <el-table-column
          type="index"
          label="排名"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          property="name"
          label="团队名"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          property="score"
          align="center"
          width="120"
          label="score">
        </el-table-column>
        <el-table-column
          property="bestTime"
          align="center"
          label="最优成绩提交时间">
        </el-table-column>
        <!--        <el-table-column-->
        <!--          align="center"-->
        <!--          width="90"-->
        <!--          label="查看团队成员">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-button size="mini" type="primary" @click="getTeamUsers(scope.row.id)">查看</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          align="center"
          width="90"
          label="查看提交记录">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="getCompetitionRecord(scope.row.competitionId,scope.row.id)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="提交结果记录"
        :visible.sync="rankInnerVisible"
        append-to-body>
        <el-card v-for="record in competitionRecords" :key="record.id" style="margin-bottom: 20px">
          <el-row>
            <el-col style="border-bottom: 1px dashed #e4e7ed;
                  padding-bottom: 10px;font-size: 16px;font-weight: 600" :span=16>
              {{ record.filename }}
            </el-col>
            <el-col style="color: #909399;font-size: 12px;font-weight: 400" :span="5">
              上传用户：{{ record.username }}
            </el-col>
            <el-col :span="3">
              <el-button type="primary" size="mini" @click="getResumeById(record.userId)">查看简历</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;margin-bottom: 15px">
            <el-col :span=6>
              <span style="color: #c0c4cc;font-size: 13px;">最终得分:</span>
              <span class="fw6">{{ record.score }}</span>
            </el-col>
            <el-col :span=8>
              <span style="color: #c0c4cc;font-size: 13px;">提交时间:</span>
              <span class="fw6">{{ record.gmtCreate }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-tag style="width:430px" type="info">备注:无</el-tag>
          </el-row>
        </el-card>
      </el-dialog>

      <el-dialog
        title="个人简历"
        :visible.sync="resumeInnerVisible"
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
            {{ resume.mobile }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              邮箱
            </template>
            {{ resume.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              毕业院校
            </template>
            <el-tag size="small">{{ resume.school }}</el-tag>
            <el-tag size="small">{{ resume.education }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              联系地址
            </template>
            {{ resume.address }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" :column="1" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              项目经历
            </template>
            {{ resume.experience }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              荣誉奖项
            </template>
            {{ resume.reward }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              专业技能
            </template>
            {{ resume.skill }}
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
// 引入调用competition.js文件
import competitionApi from '@/api/competition.js'
import userApi from '@/api/user.js'

export default {
  // 写核心代码的位置
  data() {
    // 定义变量和初始值
    return {
      competitions: [], // 查询之后接口返回集合
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      competitionQuery: {}, // 条件封装的对象 v-model双向绑定
      isLarge: 0,
      rankVisible: false,
      rankList: [],
      teamUsers: [],
      rankInnerVisible: false,
      competitionRecords: [],
      resumeInnerVisible: false,
      resume: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 创建具体的方法，调用competition.js定义的方法
    getList(page = 1) {
      this.isLarge = 0
      this.page = page
      competitionApi
        .getPageListCompetition(
          this.page,
          this.limit,
          this.competitionQuery
        )
        .then(response => {
          this.competitions = response.data.items
          this.total = response.data.total
        })
        .catch(error => {
          // 请求失败
          console.log(error)
        })
    },
    getLargeList() {
      this.isLarge = 1
      competitionApi
        .getLargeCompetition()
        .then(response => {
          console.log(response.data)
          this.competitions = response.data.large
          this.total = this.competitions.length
        })
        .catch(error => {
          // 请求失败
          console.log(error)
        })
    },
    getRankList(competitionId) {
      this.rankVisible = true
      competitionApi
        .getRankList(competitionId)
        .then(response => {
          console.log(response.data)
          this.rankList = response.data.rankList
        })
        .catch(error => {
          // 请求失败
          console.log(error)
        })
    },
    getTeamUsers(teamId) {
      this.resumeInnerVisible = true
      competitionApi
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
    getCompetitionRecord(competitionId, teamId) {
      this.rankInnerVisible = true
      competitionApi
        .getCompetitionRecord(competitionId, teamId)
        .then(response => {
          console.log(response.data)
          this.competitionRecords = response.data.records
        })
        .catch(error => {
          // 请求失败
          console.log(error)
        })
    },
    getResumeById(userId) {
      this.resumeInnerVisible = true
      userApi
        .getUserResumeById(userId)
        .then(response => {
          console.log(response.data)
          this.resume = response.data.resume
        })
        .catch(error => {
          // 请求失败
          console.log(error)
        })
    },
    resetData() {
      // 清空按钮的方法
      // 清空已输入数据
      this.competitionQuery = {}
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
        competitionApi.removeCompetition(id).then(response => {
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
  /*background-color: #f9d98e;*/
  color: #a85a11;
}

</style>
