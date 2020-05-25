<template>
  <div class="components-form-demo-advanced-search">
    <a-form-model class="ant-advanced-search-form">
      <a-row :gutter="24">
        <a-col :span="7">
          <a-form-item>
            <label class="mlabel" slot="label">文件名</label>
            <a-input v-model="queryParam.fileName" />
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item>
            <label class="mlabel" slot="label">类型</label>
            <a-select v-model="queryParam.type" placeholder="请选择" default-value="0">
              <a-select-option v-for="[key,value] in typeEnum" :key="key" :value="key">{{value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="10" :style="{display:expand?'block':'none'}">
          <a-form-item>
            <label class="mlabel" slot="label">提交时间</label>
            <a-range-picker
              v-model="queryParam.date"
              :ranges="{ 
                  '本周': [moment(), moment().endOf('week')], 
                  '本月': [moment(), moment().endOf('month')],
                  '本季度': [moment(), moment().endOf('month')],
                  '本年度':[moment(), moment().endOf('year')]
                }"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8" :style="{ textAlign: 'right' ,paddingTop:'3px',float:'right'}">
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button :style="{ marginLeft: '8px',marginBottom: '24px'} " @click="handleReset">重置</a-button>
          <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
            {{expand?'收起':'展开'}}
            <a-icon :type="expand ? 'up' : 'down'" />
          </a>
        </a-col>
      </a-row>
    </a-form-model>
    <div class="search-result-list">
      <!-- Search Result List -->
      <common-table
        ref="table"
        :columns="columns"
        url="/manage/shareFileApply/downLoadList"
        :searchParam="searchParam"
      >
        <template #fileName="fileName">
          <span>{{fileName}}</span>
        </template>
        <template #type="type">
          <span>{{typeEnum.find(([key,value])=> key === type)[1]}}</span>
        </template>
        <template #action="text, record">
          <a @click="download(record)">下载</a>
        </template>
      </common-table>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import CommonTable from "./ComTable";
import * as http from "../api/tool/http";

export default {
  components: { CommonTable },
  data() {
    return {
      labelCol: { span: 6 },
      expand: false,
      typeEnum: [
        ["1", "导出"],
        ["2", "打印"],
        ["3", "刻录"],
        ["4", "打印本地文件"],
        ["5", "刻录本地文件"],
        ["6", "导出本地文件"]
      ],
      queryParam: {
        fileName: "",
        date: [],
        type: ""
      },
      columns: [
        {
          title: "序号",
          width: 50,
          align: "center",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: "文件名",
          align: "left",
          dataIndex: "fileName"
        },
        {
          title: "类型",
          align: "left",
          dataIndex: "type"
        },
        {
          title: "用途",
          align: "left",
          dataIndex: "sharingReason"
        },
        {
          title: "提交时间",
          align: "left",
          dataIndex: "createTime",
        },
        {
          title: "操作",
          key: "action",
          width: 120,
          align: "center"
        }
      ]
    };
  },
  updated() {
    console.log("updated");
  },
  computed: {
    searchParam() {
      const { fileName, date, type } = this.queryParam;
      const beginTime = date[0] ? moment(date[0]).format("YYYY-MM-DD") : "";
      const endTime = date[1] ? moment(date[1]).format("YYYY-MM-DD") : "";
      return { fileName, beginTime, endTime, type };
    }
  },
  methods: {
    moment,
    download(r) {
      const { id, type, fileName } = r;
      http.file(
        "/manage/shareFileRecord/downloadZipFile",
        { id, type },
        fileName + ".zip"
      );
    },
    toggle() {
      this.expand = !this.expand;
    },
    handleSearch() {
      this.$refs.table.loadData();
    },
    handleReset() {
      this.queryParam.fileName = "";
      this.queryParam.date = [];
      this.queryParam.type = "";
    }
  }
};
</script>
<style>
.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

.components-form-demo-advanced-search .ant-form {
  max-width: none;
}

.components-form-demo-advanced-search .search-result-list {
  flex: 1;
  position: relative;
  overflow: auto;
}

.ant-advanced-search-form .ant-form-item-children {
  width: 100%;
  display: block;
}

.ant-advanced-search-form .ant-calendar-picker-input {
  width: 100%;
}

.mlabel {
  display: inline-block;
  width: 70px;
  padding-right: 8px;
}

.components-form-demo-advanced-search {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>