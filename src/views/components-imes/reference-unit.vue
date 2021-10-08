<template>
  <div class="imes-container">
    <!-- 参照单位 -->
    <el-form-item label="单位代码 " prop="dwdm">
      <el-input v-model="temp.dwdm" placeholder="请输入内容" @change="handleRadioDialog">
        <el-button slot="append" @click="handleRadioDialog">查询</el-button>
      </el-input>
    </el-form-item>

    <!-- 表格-dialog -->
    <el-dialog v-dialogDrag :visible.sync="dialogVisible" width="60%" append-to-body center>
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
        row-id="dwdm"
        :empty-render="{ name: 'NotData' }"
        :sort-config="{ trigger: 'cell' }"
        :filter-config="{ remote: true }"
        :pager-config="tablePage"
        :toolbar-config="tableToolbar"
        :proxy-config="tableProxy"
        :columns="tableColumn"
        :import-config="{
          types: ['csv', 'html', 'xml', 'txt'],
          modes: ['insert'],
        }"
        :export-config="{
          types: ['csv', 'html', 'xml', 'txt'],
          modes: ['current', 'selected', 'all'],
        }"
        :checkbox-config="{ reserve: true, highlight: true, range: true }"
        :radio-config="{ trigger: 'row' }"
        @cell-dblclick="cellDBLClickEvent"
      >
        <!--使用 buttons 插槽-->
        <!--  <template v-slot:buttons>
          <vxe-input v-model="temp.cInvName" placeholder="请输入存货名称" />
          <vxe-button status="primary">搜索</vxe-button>
        </template> -->
        <!--将表单放在工具栏中-->
        <template #toolbar_buttons>
          <vxe-form :data="formData" @submit="searchEvent" @reset="searchEvent">
            <vxe-form-item field="dwdm" :item-render="{name: 'input', attrs: {placeholder: '请输入搜索内容'}}" />
            <vxe-form-item :item-render="{ name: '$buttons', children: [{ props: { type: 'submit', content: '搜索', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] }" />
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
import { fetchUnitList } from '@/api/jiaxian'
export default {
  name: 'ReferenceUnit',
  components: {

  },
  props: {
    temp: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
            queryParams.keyValue = this.formData.dwdm
            return fetchUnitList(queryParams)
          }
        }
      },
      tableColumn: [
        { type: 'seq', width: 50 },
        { type: 'radio', width: 50, title: '选择' },
        {
          field: 'dwdm',
          title: '单位代码',
          width: 120,
          remoteSort: true
        },
        {
          field: 'dwmc',
          title: '单位名称',
          width: 120,
          remoteSort: true
        },
        {
          field: 'bzr',
          title: '报账人',
          width: 120,
          remoteSort: true
        },
        { field: 'jbr', title: '经办人', remoteSort: true }
      ],
      tableToolbar: {
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      formData: {
        dwdm: ''
      }
    }
  },
  methods: {
    // 打开表格查询列表模态框
    handleRadioDialog() {
      this.dialogVisible = true
      console.log(this.temp.dwdm)
      this.formData.dwdm = this.temp.dwdm
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
      this.$emit('enlarge-text', json)
      this.dialogVisible = false
    },
    // 表格搜索
    searchEvent() {
      this.$refs.childGrid.commitProxy('reload')
    }
  }
}
</script>
<style>
.el-dialog--center .el-dialog__body {
  padding: 5px 25px 5px;
}
.el-dialog__footer {
  padding: 10px 25px 10px;
}
</style>

