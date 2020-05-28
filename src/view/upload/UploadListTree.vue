<template>
  <div :style="{height:'100%'}">
    <div style="text-align:center">
      <a-button @click="fileAddFile(parentNode)" type="primary" icon="plus" style="margin-right:8px">创建目录</a-button>

      <a-upload
        :multiple="true"
        :action="url.fileUpload"
        :headers="headers"
        :beforeUpload="beforeAttachUpload"
        @change="handleAttachChange"
        :showUploadList="false"
        :fileList="attachList"
      >
        <a-button type="primary" class="upload-btn" icon="upload" @click="()=>{fileNode = parentNode}">
          <span :style="{color:'#fff'}">本地上传</span>
        </a-button>
      </a-upload>
    </div>
    <a-tree
      show-icon
      style="margin-top:20px"
      :treeData="treeData"
      :expandedKeys.sync="expandedKeys"
      :selectedKeys="[parentId]"
      @select="onSelect"
      @expand="onExpand"
      @rightClick="rightClick"
    >
      <a-icon slot="folder" type="folder" />
      <template slot="custom" slot-scope="{ selected }">
        <a-icon :type="selected ? 'folder-open' : 'folder'" />
      </template>
    </a-tree>
    <a-menu
      v-show="isRight"
      class="right-list-container"
      :selectedKeys="[]"
      :style="{top:topList,left:leftList}"
    >
      <a-menu-item @click="()=>fileAddFile(rightClickNode)">
        <span>创建目录</span>
      </a-menu-item>
      <a-divider />
      <a-menu-item class="block-menu-btn" @click="()=>{fileNode = rightClickNode}">
        <a-upload
          :multiple="true"
          :action="url.fileUpload"
          :headers="headers"
          :beforeUpload="beforeAttachUpload"
          @change="handleAttachChange"
          :showUploadList="false"
          :style="{dispaly:'block'}"
          :fileList="attachList"
        >上传</a-upload>
      </a-menu-item>
      <a-divider  v-show="rightClickNode&&rightClickNode.dirData" />
      <a-menu-item v-show="rightClickNode&&rightClickNode.dirData" @click="()=>fileModifyName(rightClickNode)">
        <span>重命名</span>
      </a-menu-item>
      <a-menu-item v-show="rightClickNode&&rightClickNode.dirData" @click="()=>fileModifyPath(rightClickNode)">
        <span>移动</span>
      </a-menu-item>
      <a-divider  v-show="rightClickNode&&rightClickNode.dirData" />
      <a-menu-item  v-show="rightClickNode&&rightClickNode.dirData" @click="fileDelete(rightClickNode)">
        <span>删除</span>
      </a-menu-item>
    </a-menu>

    <!-- 新建文件夹 -->
    <file-new ref="newFile" @update="()=>update()"></file-new>
    <!-- 重命名 -->
    <name-new ref="newName" @update="()=>update()"></name-new>
    <!-- 移动 -->
    <path-new ref="newPath" @update="()=>update()"></path-new>
  </div>
</template>
<script>
import * as http from "../../api/tool/http";
import FileNew from "./FileNew";
import NameNew from "./NameNew";
import PathNew from "./PathNew";
import { mapGetters } from "vuex";
import { ipcRenderer } from "electron";

const { domianURL } = ipcRenderer.sendSync("config");

const addCustomIcon = data => {
  for (const item of data) {
    item.scopedSlots = {
      icon: "custom"
    };
    item.slots = {
      icon: "folder"
    };
    if (item.children) {
      addCustomIcon(item.children);
    }
  }
};
// 查找父级对象
const findParentRoute = (value, list) => {
  let res = [];
  const loop = (data, temp = []) => {
    data.forEach(item => {
      if (item.value === value) {
        res = [...temp, item];
      } else {
        if (item.children) {
          loop(item.children, [...temp, item]);
        }
      }
    });
  };
  loop(list);
  return res;
};
const getNode = (treeList, key) => {
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
};
export default {
  components: { FileNew, NameNew, PathNew },
  props: ["parentId"],
  data() {
    return {
      treeData: [],
      expandedKeys:[''],
      defaultExpandedKeys:[],
      rightClickNode: null,
      fileNode: null,
      url: {
        queryByOrgCode: "/info/infoWebsite/queryByOrgCode",
        tree: "/manage/personalFileLibrary/tree",
        list: "/manage/personalFileLibrary/list",
        delete: "/manage/personalFileLibrary/delete",
        deleteBatch: "/info/article/deleteBatch",
        exportXlsUrl: "/info/article/exportXls",
        importExcelUrl: "info/article/importExcel",
        fileUpload: domianURL + "/attach/upload",
        fileDown: domianURL + "/attach/download",
        saveFile: "/manage/personalFileLibrary/addFile",
        deleteCheck: "/manage/personalFileLibrary/deleteCheck"
      },
      headers: {},
      attachList: [],

      isRight: false,
      downShow: false,

      topList: 0,
      leftList: 0
    };
  },
  computed: {
    ...mapGetters(["userToken"]),
    parentNode(){
      return getNode(this.treeData,this.parentId) || null
    }
  },
  mounted() {
    this.headers = { "X-Access-Token": this.userToken };
    this.loadTree();
  },
  methods: {
    loadTree() {
      http
        .get(this.url.tree, null)
        .then(result => {
          this.treeData = [result];
          this.treeData.forEach(item => {
            this.defaultExpandedKeys.push(item.key);

            this.expandedKeys = this.expandedKeys.filter(v=>v=='').concat([''])
          });
          addCustomIcon(this.treeData);
          if(!this.parentId) this.onSelect([''])
        })
        .catch(msg => this.$message.warning(msg || "出现错误！"));
    },
    // 新增文件夹
    addFile() {
      this.$refs.newFile.add();
      this.$refs.newFile.data = this.data;
      this.$nextTick(() => {
        this.$refs.newFile.initData({ parentId: "", fileName: "" });
      });
    },
    update() {
      this.loadTree();
      this.$emit("update");
    },

    onSelect(keys) {
      if (keys.length <= 0) return;
      this.rightClickNode = null;
      if (!keys.length) {
        this.breadList = [];
      } else {
        this.breadList = findParentRoute(keys[0], this.treeData);
      }
      console.log("key", keys[0]);
      this.$emit("changeDir", keys[0] || "", this.breadList);
      this.$emit("reloadGrid");
    },
    onExpand() {
      console.log("empty");
    },
    rightClick({ event, node }) {
      event.stopPropagation();
      this.topList = event.clientY + 10 + "px";
      this.leftList = event.clientX + 10 + "px";
      this.isRight = true;
      this.rightClickNode = getNode(this.treeData, node.value);

      document.body.onclick = () =>
        setTimeout(() => {
          this.isRight = false;
          this.rightClickNode = null;
          document.body.onclick = null;
        }, 0);
    },

    beforeAttachUpload(file) {
      this.downShow = false;
      // const fileName = file.name.toLowerCase();
      console.log(file);
      return true;
    },
    handleAttachChange({ fileList }) {
      this.attachList = this.handleFilesChange(fileList);
    },
    /**文件上传状态改变事件*/
    handleFilesChange(fileList) {
      let attachList = [...fileList];
      attachList = attachList.map(item => {
        if (item.status === "done" && item.response) {
          const json = item.response;
          if (json.success) {
            this.$message.success(`${item.name} 上传成功!`);
            this.saveFile({
              name: item.name,
              size: item.size,
              url: json.message
            });
          } else {
            item.status = "error";
            this.$message.error(`${item.name} ${json.message}!`);
          }
          delete item.response;
        } else if (item.status === "error" && item.response) {
          delete item.response;
          this.$message.error(`${item.name} 上传失败.`);
        }
        return item;
      });
      return attachList;
    },
    saveFile(item) {
      const pid = this.fileNode ? this.fileNode.value : "";
      console.log(pid);
      http
        .post(this.url.saveFile, { id: pid, fileAttaches: [item] })
        .catch(msg => this.$message.warning(msg || "出现错误！"))
        .finally(() => {
          this.$emit("update");
          this.fileNode = null;
        });
    },
    // 文件库树右键重命名
    fileModifyName(record) {
      this.$refs.newName.init({
        fileName: record.title,
        id: record.value,
        type: record.dirData.type
      });
      this.$refs.newName.data = [...this.treeData];
    },
    fileModifyPath(record) {
      this.$refs.newPath.init({
        parentId: record.dirData.parentId,
        id: record.value,
        type: record.dirData.type
      });
      this.$refs.newPath.data = [...this.treeData];
    },
    fileDelete(record, isFile = false) {
      this.$confirm({
        title: `确定删除 [${record.title}]？`,
        onOk: () => {
          this.confirmDelete(record.value, isFile);
        }
      });
    },

    fileAddFile(record) {
      const level = record.dirData?record.dirData.isdir:0;
      if (level == 2) {
        return this.$message.warning("仅支持三级目录管理！");
      }
      this.$refs.newFile.add();
      this.$refs.newFile.data = [...this.treeData];
      this.$nextTick(() => {
        this.$refs.newFile.initData({
          parentId: record.value,
          fileName: ""
        });
      });
    },

    // 文件列表重命名
    modifyName(record) {
      this.$refs.newName.init({
        fileName: record.fileName,
        id: record.id,
        type: record.type
      });
      this.$refs.newName.data = [...this.treeData];
    },
    // 确认删除文件
    confirmDelete(id, isFile) {
      http
        .put(this.url.delete, { id: id })
        .then(() => {
          this.$message.success("删除成功");
          // 如果删除的是文件
          if (isFile) return;

          // 如果删除的文件夹是当前选中的，删除后则显示此文件夹的上级文件夹
          if (
            this.breadList.length &&
            this.breadList[this.breadList.length - 1].value &&
            id == this.breadList[this.breadList.length - 1].value
          ) {
            this.breadList = this.breadList.splice(
              0,
              this.breadList.length - 1
            );
            if (
              this.breadList.length &&
              this.breadList[this.breadList.length - 1].value
            ) {
              this.onSelect([this.breadList[this.breadList.length - 1].value]);
            }
          }
          // this.loadData();
          this.loadTree();
        })
        .catch(msg => this.$message.warning(msg || "出现错误！"))
        .finally(() => {
          this.loadTree();
          this.$emit("update");
        });
    }
  }
};
</script>
<style>
.right-list-container {
  width: 120px;
  position: fixed;
  z-index: 10000;
  background: #fff;
  border: none;
  border-radius: 4px;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.08) !important;
}

.right-list-container .ant-menu-item {
  line-height: 30px !important;
  height: 30px !important;
}
.right-list-container .ant-menu-item:not(:last-child) {
  margin-bottom: 4px !important;
}
.right-list-container .ant-divider-horizontal {
  margin: 6px 0 !important;
}
.right-list-container .ant-divider-horizontal {
  margin: 6px 0 !important;
}

.block-menu-btn > span {
  display: block;
}

.block-menu-btn > span .ant-upload.ant-upload-select,
.block-menu-btn > span span.ant-upload {
  width: 100%;
  display: block;
  line-height: 30px;
}
</style>