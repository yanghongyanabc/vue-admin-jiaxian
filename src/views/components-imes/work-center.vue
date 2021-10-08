<template>
  <div class="imes-container">

    <!-- 工作中心 -->
    <el-form-item label="工作中心 " prop="workCenterName">
      <el-input v-model="temp.workCenterName" placeholder="请输入内容">
        <el-button slot="append" @click="handleRadioDialog">查询</el-button>
      </el-input>
    </el-form-item>

    <!-- 表格-dialog -->
    <el-dialog :visible.sync="dialogVisible" width="50%" append-to-body center>
      <vxe-grid
        ref="xGrid"
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
        :empty-render="{name: 'NotData'}"
        :sort-config="{trigger: 'cell'}"
        :filter-config="{remote: true}"
        :pager-config="tablePage"
        :toolbar="tableToolbar"
        :proxy-config="tableProxy"
        :columns="tableColumn"
        :import-config="{ types: ['csv', 'html', 'xml', 'txt'], modes: ['insert']}"
        :export-config="{ types: ['csv', 'html', 'xml', 'txt'], modes: ['current', 'selected', 'all']}"
        :checkbox-config="{reserve: true, highlight: true, range: true}"
        :radio-config="{ trigger: 'row'}"
        @cell-dblclick="cellDBLClickEvent"
      >
        <!--使用 buttons 插槽-->
        <!--  <template v-slot:buttons>
          <vxe-input v-model="temp.cInvName" placeholder="请输入存货名称" />
          <vxe-button status="primary">搜索</vxe-button>
        </template> -->
        <!--将表单放在工具栏中-->
        <template v-slot:buttons>
          <vxe-form :data="formData" @submit="searchEvent" @reset="searchEvent">
            <vxe-form-item field="workCenterName" :item-render="{name: 'input', attrs: {placeholder: '请输入名称'}}" />
            <vxe-form-item :item-render="{ name: '$buttons', children: [{ props: { type: 'submit', content: '搜索', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] }" />
          </vxe-form>
        </template>

        <!--自定义插槽 handle_default-->
        <!-- <template v-slot:handle_default="{ row }">
          <span>
            <template v-if="row.status === '0'">
              <el-button v-preventReClick type="primary" size="mini" icon="el-icon-circle-check" @click.stop="handleAudit(row)">审核</el-button>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click.stop="handleUpdate(row)"
              >编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-document-delete"
                @click.stop="handleDelete(row)"
              >删除</el-button>
            </template>
            <el-button v-else-if="row.status === '1'" v-preventReClick type="warning" size="mini" icon="el-icon-circle-close" @click.stop="handleGiveup(row)">弃审</el-button>
          </span>
        </template> -->
      </vxe-grid>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
        <el-button type="primary" @click="cellDBLClickEvent()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { fetchList } from '@/api/work-center'
export default {
  name: 'WorkCenter',
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
      /* status: 'create',
      buttonMap: {
        create: '查询数据',
        update: '更新数据'
      }, */
      //   ------------------------------------弹框表格data---------------------
      tablePage: {
        pageSize: 10,
        pageSizes: [10, 20, 50, 100]
      },
      tableProxy: {
        seq: true, // 启用动态序号代理
        sort: true, // 启用排序代理
        filter: true, // 启用筛选代理
        form: true, // 启用表单代理
        props: {
          result: 'result', // 配置响应结果列表字段
          total: 'page.total' // 配置响应结果总页数字段
        },
        ajax: {
          // 任何支持 Promise API 的库都可以对接（fetch、jquery、axios、xe-ajax）
          //   query: ({ page }) => fetchList(page.currentPage, page.pageSize),
          //   query: ({ page }) => fetchList(this.listQuery),
          query: ({ page }) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                const list = [
                  {
                    workCenterName: '普通石墨化111',
                    id: '1111'
                  },
                  {
                    workCenterName: '普通石墨化222',
                    id: '2222'
                  }
                ]
                resolve({
                  page: {
                    total: list.length
                  },
                  result: list.slice(
                    (page.currentPage - 1) * page.pageSize,
                    page.currentPage * page.pageSize
                  )
                })
              }, 100)
            })
          }
          // body 对象： { removeRecords }
          /* delete: ({ body }) => fetchList(body),
          save: ({ body }) => fetchList(body) */
        }
      },
      tableColumn: [
        { type: 'seq', width: 50 },
        { type: 'radio', width: 50, title: '选择' },
        {
          field: 'workCenterName',
          title: '工作中心',
          width: 120,
          remoteSort: true
        },
        {
          field: 'belongDepartment',
          title: '所属部门',
          width: 120,
          remoteSort: true
        },
        {
          field: 'createDate',
          title: '创建时间',
          width: 120,
          remoteSort: true
        },
        { field: 'creatorName', title: '创建人', width: 120, remoteSort: true },
        { field: 'note', title: '备注', width: 120, remoteSort: true }
      ],
      tableToolbar: {
        id: 'toolbar_demo_1'
        /* buttons: [
          { code: 'insert_actived', name: '新增方案', status: 'primary', icon: 'iconfont iconadd-select' }
        ], */
        /* refresh: true,
        import: true,
        export: true,
        zoom: true,
        resizable: {
          storage: true
        },
        custom: {
          storage: true
        } */
      },
      formData: {
        workCenterName: ''
      }
    }
  },
  methods: {
    // 打开表格查询列表模态框
    handleRadioDialog() {
      this.dialogVisible = true
      this.$refs.xGrid.clearRadioRow()
      this.formData.workCenterName = ''
      this.$refs.xGrid.commitProxy('reload')
    },
    // 弹框表格双击事件/确定（选中）
    cellDBLClickEvent() {
      const json = this.$refs.xGrid.getRadioRecord()
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
      this.$refs.xGrid.commitProxy('reload')
    }
  }
}
</script>
<style>
.el-dialog--center .el-dialog__body{
    padding:5px 25px 5px
}
.el-dialog__footer{
    padding:10px 25px 10px
}
</style>

