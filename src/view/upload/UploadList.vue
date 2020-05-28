<template>
  <div :style="{height:'100%',display: 'flex',flexDirection: 'row'}">
    <com-page :style="{width:'280px',marginRight:'24px'}">
      <upload-list-tree
        ref="tree"
        :parentId="queryParam.parentId "
        @changeDir="(node,route)=>updateSelected(node,route)"
        @update="()=>{reloadGrid()}"
        @reloadGrid="()=>{handleReset();reloadGrid()}"
      />
    </com-page>
    <com-page :style="{flex:'1',display:'flex',flexDirection: 'column'}">
      <a-form-model>
        <a-row :gutter="24" :style="{display:'flex'}">
          <a-col :style="{ flex:'1',lineHeight:'40px'}">{{'/ '+dirRoute.map(v=>v.title).join(' / ')}}</a-col>
          <a-col :style="{ textAlign: 'right' ,paddingTop:'3px',float:'right'}">
            <a-form-item :style="{float:'left',marginRight:'24px',marginTop:'-4px'}">
              <a-input v-model="queryParam.fileName" placeholder="请输入文件名" />
            </a-form-item>
            <a-button type="primary" @click="reloadGrid">搜索</a-button>
            <a-button :style="{ marginLeft: '8px',marginBottom: '24px'} " @click="handleReset">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="search-result-list">
        <com-table
          ref="table"
          :columns="columns"
          :url="'/manage/personalFileLibrary/list'"
          :searchParam="queryParam"
        >
          <template #action="text, record">
            <a @click="()=>rename(record)">重命名</a>
            <a-divider type="vertical" />
            <a @click="()=>move(record)">移动</a>
            <a-divider type="vertical" />
            <a @click="()=>del(record)">删除</a>
          </template>
        </com-table>
      </div>
    </com-page>
  </div>
</template>
<script>
import ComPage from "../ComPage";
import UploadListTree from "./UploadListTree";
import ComTable from "../ComTable";

export default {
  components: { ComPage, UploadListTree, ComTable },
  computed: {},
  data() {
    return {
      queryParam: {
        parentId: "",
        fileName: ""
      },
      dirRoute: [],
      // 表头
      columns: [
        {
          title: "文件名",
          align: "left",
          dataIndex: "fileName"
        },
        {
          title: "修改日期",
          align: "left",
          dataIndex: "updateTime",
          sorter: true
          // customRender: function (text) {
          //   return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          // }
        },
        {
          title: "大小",
          align: "left",
          sorter: true,
          dataIndex: "fileSize",
          customRender(fileByte) {
            if (!fileByte) return "";
            const fileSizeByte = fileByte;
            let fileSizeMsg = "";
            if (fileSizeByte < 1048576)
              fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
            else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
            else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824)
              fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
            else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824)
              fileSizeMsg = "1GB";
            else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776)
              fileSizeMsg =
                (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
            else fileSizeMsg = "文件超过1TB";
            return fileSizeMsg;
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          scopedSlots: { customRender: "action" },
          align: "center"
        }
      ]
    };
  },
  methods: {
    handleReset() {
      this.queryParam.fileName = "";
    },

    updateSelected(selectId = "", route = []) {
      this.queryParam.parentId = selectId;
      this.dirRoute = route;
    },
    reloadGrid() {
      console.log(this.queryParam.parentId);
      this.$refs.table.loadData();
    },
    rename(r) {
      this.$refs.tree.modifyName(r);
    },
    move(r) {
      this.$refs.tree.fileModifyPath({ dirData: r, value: r.id });
    },
    del(r) {
      this.$refs.tree.fileDelete(
        {
          value: r.id,
          title: r.fileName
        },
        true
      );
    }
  }
};
</script>
<style>
.search-result-list {
  flex: 1;
  position: relative;
  overflow: auto;
}
</style>