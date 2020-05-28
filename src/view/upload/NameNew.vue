<template>
  <div>
    <a-modal
      title="重命名"
      :visible="modalVisible"
      width="600px"
      centered
      :confirmLoading="confirmLoading"
      @ok="rename"
      @cancel="()=>modalVisible=false"
    >
      <a-form :form="form">
        <a-row :gutter="8">
          <a-col :span="24"></a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="24">
            <a-form-item :label="labelName" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                v-decorator="['fileName', validatorRules.fileName]"
                placeholder="请输入文件名"
                maxlength="50"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import * as http from "../../api/tool/http";

export default {
  name: "NameNew",
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      },
      required: false
    }
  },
  data() {
    return {
      modalVisible: false,
      data: [],
      confirmLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      validatorRules: {
        fileName: { rules: [{ required: true, message: "请输入文件名!" }] }
      },
      form: this.$form.createForm(this),
      id: "",
      type: "", //'0'为文件夹，'1'为文件
      labelName: "文件夹名称",
      fileSuffix: ""
    };
  },
  methods: {
    init(data) {
      this.form.resetFields();
      this.modalVisible = true;
      this.id = data.id;
      this.type = data.type;
      this.$nextTick(() => {
        if (this.type == "0") {
          this.labelName = "文件夹名称";
        } else {
          this.labelName = "文件名称";
          const name = data.fileName;
          data.fileName = name.substring(0, name.lastIndexOf("."));
          this.fileSuffix = name.substring(name.lastIndexOf("."), name.length);
        }
        const { fileName } = data;
        this.form.setFieldsValue({ fileName });
      });
    },
    rename() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (err) {
          this.$message.warning("请完成表单必填项！");
          return;
        }
        values.id = this.id;
        let url = "/manage/personalFileLibrary/fileRename";
        if (this.type == "0") {
          url = "/manage/personalFileLibrary/dirRename";
        }
        if (this.type == "1") {
          values.fileName = values.fileName + this.fileSuffix;
        }
        http
          .put(url, values)
          .then(() => {
            this.$emit("update");
          })
          .catch(msg => this.$message.warning(msg||"出现错误！"))
          .finally(() => {
            this.visible = false;
            this.confirmLoading = false;
            this.modalVisible = false;
          });
      });
    }
  }
};
</script>
<style scoped>
</style>