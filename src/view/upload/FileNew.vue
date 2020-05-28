<template>
  <div>
    <a-modal
      title="新建文件夹"
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
                @select="onSelect"
              ></a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="24">
            <a-form-item label="文件夹名称" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                v-decorator="['fileName', validatorRules.fileName]"
                placeholder="请输入文件名"
                :maxLength="50"
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



const getNode=(treeList, key)=>{
  for (let i = 0; i < treeList.length; i++) {
    const node = treeList[i];
    if (key === node.key) {
      return node;
    } else {
      if (node.children && node.children.length > 0) {
        const child = getNode(node.children, key);
        if (child != null) {
          return child;
        }
      }
    }
  }
  return null;
}


export default {
  name: "FileNew",
  components: {},
  props: {},
  
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
      selectedLevel: ""
    };
  },
  computed: {
    treeData(){
      return [ { title: "根目录", value: "", children: this.data }]
    }
  },
  methods: {
    initData(data) {
      const {parentId,fileName} = data
      this.form.setFieldsValue({parentId,fileName});
    },
    add() {
      this.form.resetFields();
      this.modalVisible = true;
    },
    addFile() {
      if (this.selectedLevel == "2") {
        this.$message.warning("仅支持三级目录管理！");
        return;
      }
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (err) {
          this.$message.warning("请完成表单必填项！");
          this.confirmLoading = false;
          return;
        }
        if (!values.parentId) {
          values.parentId = "";
        }
        http
          .post("/manage/personalFileLibrary/addDir", values)
          .then(() => {
            this.modalVisible = false;
            this.$emit("update");
          })
          .catch(msg => this.$message.warning(msg||"出现错误！"))
          .finally(() => (this.confirmLoading = false));
      });
    },
    onSelect(keys) {
      const curObj = getNode(this.data, keys);
      if (curObj) {
        this.selectedLevel = curObj.dirData && curObj.dirData.isdir;
      }
    }
  }
};
</script>
<style scoped>
</style>