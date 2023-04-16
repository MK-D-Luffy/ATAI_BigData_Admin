<template>
  <div class="app-container">
    <div style="font-size: 19PX; font-weight: 600; margin-bottom: 20px; margin-left: 20px;">
      <div v-if="this.$route.params && this.$route.params.id">修改课程</div>
      <div v-else>添加课程</div>
    </div>

    <el-form label-width="120px">
      <el-form-item label="课程封面">
        <el-image style="width:300px" :src="course.cover"></el-image>
      </el-form-item>
      <el-form-item label="课程名称">
        <el-input v-model="course.name"/>
      </el-form-item>
      <el-form-item label="课程简介">
        <el-input v-model="course.intro" :rows="5" type="textarea"/>
      </el-form-item>
      <el-form-item label="课程类型">
        <el-select v-model="course.level" clearable placeholder="请选择">
          <el-option value="入门" label="入门"/>
          <el-option value="进阶" label="进阶"/>
          <el-option value="实战" label="实战"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程技术">
        <el-select v-model="course.tech" clearable placeholder="请选择">
          <el-option value="机器学习/深度学习" label="机器学习/深度学习"/>
          <el-option value="工具与框架" label="工具与框架"/>
          <el-option value="计算机视觉" label="计算机视觉"/>
          <el-option value="自然语言处理" label="自然语言处理"/>
          <el-option value="智能数据分析" label="智能数据分析"/>
          <el-option value="智能语音" label="智能语音"/>
          <el-option value="AI其他" label="AI其他"/>
        </el-select>
      </el-form-item>
      <!-- 截止日期 -->
      <el-form-item label="开课时间">
        <el-date-picker
          v-model="course.begin"
          align="right"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="结课时间">
        <el-date-picker
          v-model="course.end"
          align="right"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="课程描述">
        <tinymce :height="200" v-model="course.description"/>
      </el-form-item>
      <el-form-item style="width:1300px" label="课时信息">
        <el-table :data="courseClass" element-loading-text="数据加载中" border fit highlight-current-row>

          <el-table-column label="上传数据" width="80" align="center" type="expand">
<!--            <template slot-scope="scope">{{ scope.$index + 1 }}</template>-->
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="选择视频">
                  <el-upload
                    ref="upload"
                    :auto-upload="false"
                    :on-success="fileUploadSuccess"
                    :on-error="fileUploadError"
                    :disabled="importBtnDisabled"
                    :limit="1"
                    :action="BASE_API+'/ataioss/fileoss'"
                    name="file"
                    accept=".doc, .docx,.txt, .xls, .xlsx, .ppt, .pptx, .pdf, .zip, .rar"
                  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button
                      :loading="loading"
                      style="margin-left: 10px;"
                      size="small"
                      type="success"
                      @click="submitUpload"
                    >{{ fileUploadBtnText }}
                    </el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="选择pdf文件">
                  <el-upload
                    ref="upload1"
                    :auto-upload="false"
                    :on-success="fileUploadSuccess1"
                    :on-error="fileUploadError"
                    :disabled="importBtnDisabled1"
                    :limit="1"
                    :action="BASE_API+'/ataioss/fileoss'"
                    name="file"
                    accept=".xls, .xlsx, .txt"
                  >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button
                      :loading="loading1"
                      style="margin-left: 10px;"
                      size="small"
                      type="success"
                      @click="submitUpload1"
                    >{{ fileUploadBtnText1 }}
                    </el-button>
                  </el-upload>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="课时次序" width="90" align="center" prop="order">
          </el-table-column>
          <el-table-column label="课时名" align="center" prop="name">
          </el-table-column>
          <el-table-column label="课时视频" width="200" align="center" prop="video">
          </el-table-column>
          <el-table-column label="课时pdf" width="200" align="center" prop="pdf">
          </el-table-column>

          <el-table-column  width="270" align="center">
            <template slot="header" slot-scope="scope">
              <el-button size="mini" type="primary">添加课时</el-button>
            </template>
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="前置知识">
        <el-input v-model="course.bLearning" :rows="3" type="textarea"/>
      </el-form-item>
      <el-form-item label="课程目标">
        <el-input v-model="course.goals" :rows="3" type="textarea"/>
      </el-form-item>
      <el-form-item label="资源信息">
        <el-input v-model="course.resource" :rows="3" type="textarea"/>
      </el-form-item>
      <el-form-item label="参考资料">
        <el-input v-model="course.references" :rows="3" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入调用 course.js文件
import courseApi from '@/api/course'
// 引入上传头像的功能组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
// 引入Tinymce富文本编辑器
import Tinymce from '@/components/Tinymce'

export default {
  components: {ImageCropper, PanThumb, Tinymce}, // 组件的声明
  data() {
    return {
      course: {
        cover: 'https://jiutian.10086.cn/edu/objects-download/76b106f68cb743d6893871627a30a37f%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C.png'
      }, // v-model双向绑定
      fileUploadBtnText: '上传到服务器', // 按钮文字
      fileUploadBtnText1: '上传到服务器', // 按钮文字
      BASE_API: process.env.BASE_API, // 获取dev.env.js里面地址
      saveBtnDisabled: false, // 保存按钮是否禁用
      importBtnDisabled: false, // 按钮是否禁用,
      importBtnDisabled1: false, // 按钮是否禁用,
      loading: false,
      loading1: false,
      classList: null,
      courseClass: []
    }
  },
  watch: {
    // vue的监听
    $route(to, from) {
      // 路由变化方式，路由一发生变化 就执行方法
      this.init()
    }
  },
  created() {
    // 页面渲染前执行
    this.init()
  },
  methods: {
    init() {
      // 判断路径有id值  修改操作
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getInfo(id)
        this.getCourseClass(id)
      } else {
        // 判断路径没有id值  添加操作
        // 清空表单即清空 course
        this.course = {
          cover: 'https://jiutian.10086.cn/edu/objects-download/76b106f68cb743d6893871627a30a37f%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C.png'
        } // v-model双向绑定
      }
    },
    // 根据课程id查到课程信息 回显操作
    getInfo(id) {
      courseApi
        .getCourseById(id)
        .then(response => {
          this.course = response.data.course
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          })
        })
    },
    getCourseClass(courseId) {
      courseApi
        .getCourseClass(courseId)
        .then(response => {
          this.courseClass = response.data.courseClassList
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          })
        })
    },
    // 保存按钮调用的方法
    saveOrUpdate() {
      this.course.submitCounts = this.submitCounts;
      // 判断修改或添加 course 是否有id
      if (!this.course.id) {
        // 添加
        this.addCourse()
      } else {
        // 修改
        this.updateCourse()
      }
    },

    // 添加课程的方法
    addCourse() {
      courseApi
        .addCourseInfo(this.course)
        .then(response => {
          // 添加成功
          // 提示成功
          this.$message({
            type: 'success',
            message: '添加成功！ 😄'
          })
          // 回到课程列表页面
          // vue路由跳转
          this.$router.push({
            path: '/comp/table'
          })
        })
    },

    // 修改课程的方法
    updateCourse() {
      courseApi
        .updateCourse(this.course)
        .then(response => {
          // 修改成功
          // 提示成功
          this.$message({
            type: 'success',
            message: '修改成功！ 🧙‍♂️'
          })
          // 回到讲师列表页面
          // vue路由跳转
          this.$router.push({
            path: '/comp/table'
          })
        })
    },

    submitUpload() {
      // debugger
      if (this.$refs.upload.$data.uploadFiles.length > 0) {
        this.fileUploadBtnText = '正在上传'
        this.importBtnDisabled = true
        this.loading = true
        this.$refs.upload.submit() // js:document.getElementById("upload:).submit()
      } else {
        this.$message({
          type: 'warning',
          message: '请选择文件'
        })
      }
    },

    submitUpload1() {
      debugger
      if (this.$refs.upload1.$data.uploadFiles.length > 0) {
        this.fileUploadBtnText1 = '正在上传'
        this.importBtnDisabled1 = true
        this.loading1 = true
        this.$refs.upload1.submit() // js:document.getElementById("upload:).submit()
      } else {
        this.$message({
          type: 'warning',
          message: '请选择文件'
        })
      }
    },

    // 上传成功
    fileUploadSuccess(response) {
      // 提示信息
      if (response.success === true) {
        this.fileUploadBtnText = '导入成功'
        this.loading = false
        this.course.cover = response.data.url
        console.log(this.course.cover)
        this.$message({
          type: 'success',
          message: response.message
        })
      } else {
        this.fileUploadBtnText = '重新上传'
        this.loading = false
        this.importBtnDisabled = false
        this.$message({
          type: 'warning',
          message: response.message
        })
      }
    },
    // 上传成功
    fileUploadSuccess1(response) {
      // 提示信息
      if (response.success === true) {
        this.fileUploadBtnText1 = '导入成功'
        this.loading1 = false
        this.course.result = response.data.url
        console.log(this.course.result)
        this.$message({
          type: 'success',
          message: response.message
        })
      } else {
        this.fileUploadBtnText1 = '重新上传'
        this.loading1 = false
        this.importBtnDisabled1 = false
        this.$message({
          type: 'warning',
          message: response.message
        })
      }
    },
    // 上传失败
    fileUploadError() {
      this.fileUploadBtnText = '重新上传'
      this.importBtnDisabled = false
      this.loading = false
      this.$message({
        type: 'error',
        message: '导入文件失败'
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar-uploader img {
  width: 178px;
  height: 178px;
  display: block;
}

.tinymce-container {
  line-height: 29px;
}

.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
