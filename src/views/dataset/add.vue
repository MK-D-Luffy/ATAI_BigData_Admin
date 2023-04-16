<template>
  <div class="app-container">
    <div style="font-size: 19PX; font-weight: 600; margin-bottom: 20px; margin-left: 20px;">
      <div v-if="this.$route.params && this.$route.params.id">修改比赛</div>
      <div v-else>添加比赛</div>
    </div>

    <el-form label-width="120px">
      <el-form-item label="数据集封面">
        <el-image style="width: 300px" :src="dataset.image"></el-image>
      </el-form-item>
      <el-form-item label="数据集名称">
        <el-input v-model="dataset.name"/>
      </el-form-item>
      <el-form-item label="数据集技术">
        <el-select v-model="dataset.level" clearable placeholder="请选择">
          <el-option value="官方赛" label="官方赛"/>
          <el-option value="训练赛" label="训练赛"/>
        </el-select>
      </el-form-item>
      <el-form-item label="数据集简介">
        <el-input v-model="dataset.intro" :rows="5" type="textarea"/>
      </el-form-item>
      <el-form-item label="选择数据集">
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
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入调用 dataset.js文件
import datasetApi from '@/api/dataset'
// 引入上传头像的功能组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
// 引入Tinymce富文本编辑器
import Tinymce from '@/components/Tinymce'

export default {
  components: {ImageCropper, PanThumb, Tinymce}, // 组件的声明
  data() {
    return {
      dataset: {}, // v-model双向绑定
      fileUploadBtnText: '上传到服务器', // 按钮文字
      BASE_API: process.env.BASE_API, // 获取dev.env.js里面地址
      saveBtnDisabled: false, // 保存按钮是否禁用
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false,
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
      } else {
        // 判断路径没有id值  添加操作
        // 清空表单即清空 dataset
        this.dataset = {
          image:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        } // v-model双向绑定
      }
    },
    // 根据比赛id查到比赛信息 回显操作
    getInfo(id) {
      datasetApi
        .getDatasetById(id)
        .then(response => {
          this.dataset = response.data.dataset
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
      this.dataset.submitCounts = this.submitCounts;
      // 判断修改或添加 dataset 是否有id
      if (!this.dataset.id) {
        // 添加
        this.addDataset()
      } else {
        // 修改
        this.updateDataset()
      }
    },
    // 添加比赛的方法
    addDataset() {
      datasetApi
        .addDatasetInfo(this.dataset)
        .then(response => {
          // 添加成功
          // 提示成功
          this.$message({
            type: 'success',
            message: '添加成功！ 😄'
          })
          // 回到比赛列表页面
          // vue路由跳转
          this.$router.push({
            path: '/comp/table'
          })
        })
    },
    // 修改比赛的方法
    updateDataset() {
      datasetApi
        .updateDataset(this.dataset)
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
    // 上传成功
    fileUploadSuccess(response) {
      // 提示信息
      if (response.success === true) {
        this.fileUploadBtnText = '导入成功'
        this.loading = false
        this.dataset.cover = response.data.url
        console.log(this.dataset.cover)
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
</style>
