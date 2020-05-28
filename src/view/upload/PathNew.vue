<template>
  <div>
    <a-modal
      title="移动到"
      :visible="modalVisible"
      width="600px"
      centered
      :confirmLoading="confirmLoading"
      @ok="addFile"
      @cancel="()=>modalVisible=false"
    >
      <a-form :form="form">
        <a-row :gutter="8">
          <a-col :span="24">
            <a-form-item label="所属文件夹" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-tree-select
                v-if="treeData.length>0"
                treeDefaultExpandAll
                :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                :treeData="treeData"
                v-decorator="['parentId', validatorRules.parentId]"
                placeholder="请选择文件夹"
              ></a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="24">
            <!-- <a-form-item v-show="!isMove" label="文件夹名称" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-decorator="['fileName', validatorRules.fileName]" placeholder="请输入文件名"></a-input>
            </a-form-item>-->
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import * as http from "../../api/tool/http";

export default {
  name: "PathNew",
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
        parentId: {},
        fileName: { rules: [{ required: true, message: "请输入文件名!" }] }
      },
      form: this.$form.createForm(this),
      id: "",
      type: "" //'0'为文件夹，'1'为文件
    };
  },
  computed: {
    treeData() {
      const filterTree = (arr, key) => {
        return arr
          .filter(ele => ele.value !== key)
          .map(v => {
            if (v.children && v.children instanceof Array)
              return Object.assign({}, v, {
                children: filterTree(v.children, key)
              });
            else return Object.assign({}, v);
          });
      }
      return filterTree(this.data,this.id) 
    }
  },
  methods: {
    init(data) {
      this.form.resetFields();
      this.modalVisible = true;
      this.id = data.id;
      this.type = data.type;
      this.$nextTick(() => {
        const { parentId } = data;
        this.form.setFieldsValue({ parentId });
      });
      console.log(this.treeData)
    },
    addFile() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (err) {
          this.$message.warning("请完成表单必填项！");
          return;
        }
        values.id = this.id;
        let url = "/manage/personalFileLibrary/fileMove";
        if (this.type == "0") {
          url = "/manage/personalFileLibrary/dirMove";
        }
        http
          .put(url, values)
          .then(() => this.$emit("update"))
          .catch(msg => this.$message.warning(msg))
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