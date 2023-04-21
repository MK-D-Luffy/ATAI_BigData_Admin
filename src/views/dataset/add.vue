<template>
  <div class="app-container">
    <div style="font-size: 19PX; font-weight: 600; margin-bottom: 20px; margin-left: 20px;color: #a85a11;">
      <div v-if="this.$route.params && this.$route.params.id">修改数据集</div>
      <div v-else>添加数据集</div>
    </div>

    <el-form label-width="120px">
      <el-form-item label="数据集封面">
        <el-upload
          style="width:320px;"
          :show-file-list="true"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          action=" http://localhost:8666/ataioss/fileoss">
          <el-image v-if="dataset.image" :src="dataset.image"></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="数据集名称">
        <el-input v-model="dataset.name"/>
      </el-form-item>
      <el-form-item label="数据集分类">
        <el-radio-group v-model="dataset.category">
          <el-radio label="互联网">互联网</el-radio>
          <el-radio label="金融">金融</el-radio>
          <el-radio label="语言学">语言学</el-radio>
          <el-radio label="卫生保健">卫生保健</el-radio>
          <el-radio label="人口统计学">人口统计学</el-radio>
          <el-radio label="商业">商业</el-radio>
          <el-radio label="农业">农业</el-radio>
          <el-radio label="政治">政治</el-radio>
          <el-radio label="其他">其他</el-radio>
        </el-radio-group>
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
      dialogImageUrl: '',
      dialogVisible: false
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
          image: ''
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
            path: '/dataset/table'
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
            path: '/dataset/table'
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
        this.dataset.image = response.data.url
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
    },
    // 头像上传成功
    handleAvatarSuccess(response) {
      if (response.success) {
        this.dataset.image = response.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败! （非20000）')
      }
    },
    // 头像上传失败（http）
    handleAvatarError() {
      this.$message.error('上传失败! （http失败）')
    },
    // 上传校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return (isJPG || isPNG) && isLt1M
    },
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
