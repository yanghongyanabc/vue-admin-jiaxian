<template>
  <div class="components-wrapper">
    <template>
      <el-input v-show="inputVisible" v-model="row.yszbdh" size="small" placeholder="请输入" @blur="onHandleBlur" @change="handleRadioDialog(row)">
        <el-button slot="append" @click="handleRadioDialog(row)">查询</el-button>
      </el-input>
      <div v-show="!inputVisible" style="width:100%;height:24px" @click="onHandleFocus">{{ row.yszbdh }}</div>
    </template>
    <!-- <el-button
      class="searchButton"
      type="info"
      size="small"
      @click="handleRadioDialog(row)"
    ><i class="fa fa-search" /></el-button> -->
    <!-- 弹窗表格-dialog -->
    <el-dialog v-dialogDrag :visible.sync="dialogVisible" width="70%" append-to-body center>
      <vxe-grid
        ref="childGrid"
        border
        stripe
        resizable
        show-overflow
        highlight-hover-row
        highlight-current-row
        keep-source
        size="mini"
        max-height="400"
        row-id="id"
        :empty-render="{ name: 'NotData' }"
        :sort-config="{ trigger: 'cell' }"
        :filter-config="{ remote: true }"
        :pager-config="tablePage"
        :toolbar-config="tableToolbar"
        :proxy-config="tableProxy"
        :columns="tableColumn"
        :checkbox-config="{ reserve: true, highlight: true, range: true }"
        :radio-config="{ trigger: 'row' }"
        @cell-dblclick="cellDBLClickEvent"
      >
        <!--使用 buttons 插槽-->
        <!--  <template v-slot:buttons>
          <vxe-input v-model="temp.cInvName" placeholder="请输入存货名称" />
          <vxe-button status="primary">搜索</vxe-button>
        </template> -->

        <!--自定义插槽 toolbar buttons 插槽-->
        <template #toolbar_buttons>
          <vxe-form :data="formData" @submit="searchEvent" @reset="searchEvent">
            <vxe-form-item
              field="yszbNo"
              :item-render="{
                name: 'input',
                clearable: 'true',
                attrs: { placeholder: '请输入查询内容' },
              }"
            />
            <vxe-form-item
              :item-render="{
                name: '$buttons',
                children: [
                  {
                    props: {
                      type: 'submit',
                      content: '搜索',
                      status: 'primary',
                    },
                  }
                ],
              }"
            />
          </vxe-form>
        </template>
      </vxe-grid>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
        <el-button type="primary" @click="cellDBLClickEvent()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchZhibiaoList } from '@/api/jiaxian'

export default {
  name: 'IndexInformation',
  components: {},
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    condition: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputVisible: true,
      dialogVisible: false,
      //   ------------------------------------弹框表格data---------------------
      tablePage: {
        pageSize: 100,
        pageSizes: [100, 200, 500]
      },
      tableProxy: {
        seq: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理
        form: true, // 启用表单代理
        props: {
          result: 'data',
          total: 'totalCount'
        },
        ajax: {
          // 任何支持 Promise API 的库都可以对接（fetch、jquery、axios、xe-ajax）
          //   query: ({ page }) => fetchList(page.currentPage, page.pageSize),
          //   query: ({ page }) => fetchList(this.listQuery),
          query: ({ page, sort, form }) => {
            // 处理排序条件
            const queryParams = Object.assign(
              {
                sort: sort.property,
                order: sort.order
              },
              form
            )

            queryParams.pageNum = page.currentPage
            queryParams.pageSize = page.pageSize
            queryParams.keyValue = this.condition + ',' + this.subject + ',' + this.formData.yszbNo
            return fetchZhibiaoList(queryParams)
          }
        }
      },
      tableColumn: [
        { type: 'seq', width: 50 },
        { type: 'radio', width: 50, title: '选择' },
        {
          field: 'gnflCode',
          title: '功能分类编码',
          width: 140,
          remoteSort: true
        },
        { field: 'gnfl', title: '功能分类', width: 140, remoteSort: true },
        {
          field: 'yskmCode',
          title: '预算科目编码',
          width: 140,
          remoteSort: true
        },
        { field: 'yskm', title: '预算科目', width: 140, remoteSort: true },
        { field: 'dqysje', title: '当前预算金额', width: 160 },
        { field: 'yszbNo', title: '预算单编号', width: 140, remoteSort: true },
        { field: 'ysYear', title: '预算年度', width: 140, remoteSort: true },
        {
          field: 'ysUnitCode',
          title: '预算单位代码',
          width: 140,
          remoteSort: true
        },
        { field: 'YsUnit', title: '预算单位', width: 140, remoteSort: true },
        {
          field: 'payTypeCode',
          title: '支付方式编码',
          width: 140,
          remoteSort: true
        },
        { field: 'payType', title: '支付方式', width: 140, remoteSort: true },
        {
          field: 'ysTypeCode',
          title: '预算类型编码',
          width: 140,
          remoteSort: true
        },
        { field: 'ysType', title: '预算类型', width: 140, remoteSort: true },
        {
          field: 'zjxzCode',
          title: '资金性质编码',
          width: 140,
          remoteSort: true
        },
        { field: 'zjxz', title: '资金性质', width: 140, remoteSort: true }

      ],
      tableToolbar: {
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      formData: {
        yszbNo: ''
      },
      pId: null
    }
  },
  created() {},
  methods: {
    // 打开表格查询列表模态框
    handleRadioDialog(row) {
      console.log(this.row)
      this.pId = row.autoId
      this.dialogVisible = true
      this.formData.yszbNo = this.row.yszbdh
      this.$nextTick(() => {
        this.$refs.childGrid.commitProxy('reload')
      })
    },
    // 弹框表格双击事件/确定（选中）
    cellDBLClickEvent() {
      const json = this.$refs.childGrid.getRadioRecord()
      if (json === null) {
        this.$message({
          message: '请选择表格数据',
          type: 'error'
        })
        return
      }
      json.id = this.pId
      this.$emit('enlarge-text', json)
      this.dialogVisible = false
    },
    // 表格搜索
    searchEvent() {
      this.$refs.childGrid.commitProxy('reload')
    },
    onHandleBlur() {
      this.inputVisible = false
    },
    onHandleFocus() {
      this.inputVisible = true
    }
  }
}
</script>

<style type="text/css" scoped>
.components-wrapper {
  display: inline-block;
}
</style>
