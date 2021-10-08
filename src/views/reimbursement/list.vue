<template>
  <div class="app-container">
    <!-- 表格 -->
    <vxe-grid id="xGrid" ref="xGrid" v-bind="gridOptions" @form-reset="handleFormReset" @cell-dblclick="cellDBLClickEvent">
      <template #toolbar_buttons>
        <router-link to="/create">
          <el-button type="primary" size="small" icon="fa fa-plus">
            新增
          </el-button>
        </router-link>
        <!-- <el-button
          type="danger"
          size="small"
          icon="fa fa-trash-o"
          @click="handleDelete()"
        >
          删除</el-button>
        <el-button
          type="warning"
          size="small"
          icon="fa fa-download"
          @click="$refs.xGrid.exportData()"
        >
          导出.csv</el-button> -->
      </template>

      <!--自定义插槽 handle_default-->
      <template v-slot:handle_default="{ row }">
        <router-link :to="'/edit/' + row.pk">
          <el-button type="success" size="small" icon="el-icon-zoom-in">
            查看
          </el-button>
        </router-link>
        <router-link :to="'/edit/' + row.pk" style="margin-left:10px;">
          <el-button type="primary" size="small" icon="el-icon-edit">
            编辑
          </el-button>
        </router-link>
        <el-button
          type="danger"
          size="small"
          icon="fa fa-trash-o"
          style="margin-left:10px;"
          @click="handleDelete(row)"
        >
          删除</el-button>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import { fetchList, deleteList } from '@/api/bzd-add'

export default {
  name: 'ListReimbursement',
  components: {},
  data() {
    return {
      gridOptions: {
        stripe: true,
        border: true,
        resizable: true,
        showHeaderOverflow: true,
        showOverflow: true,
        highlightHoverRow: true,
        keepSource: true,
        id: 'full_edit_1',
        height: 800,
        rowId: 'id',
        customConfig: {
          storage: true,
          checkMethod: this.checkColumnMethod
        },
        printConfig: {
          columns: [
            { field: 'name' },
            { field: 'email' },
            { field: 'nickname' },
            { field: 'age' },
            { field: 'amount' }
          ]
        },
        sortConfig: {
          trigger: 'cell',
          remote: true
        },
        filterConfig: {
          remote: true
        },
        pagerConfig: {
          pageSize: 10,
          pageSizes: [5, 10, 20, 50, 100, 500, 1000]
        },
        formConfig: {
          titleWidth: 100,
          titleAlign: 'right',
          items: [
            {
              field: 'cNo',
              title: '单据编号',
              span: 8,
              /* titlePrefix: {
                message: '请选择单据编号',
                icon: 'fa fa-info-circle'
              }, */
              itemRender: {
                name: '$input',
                props: { placeholder: '请输入单据编号' }
              }
            },
            {
              field: 'dDate',
              title: '业务日期',
              span: 10,
              itemRender: {
                name: 'DatePicker'
              }
            },
            {
              span: 6,
              align: 'center',
              collapseNode: true,
              itemRender: {
                name: '$buttons',
                children: [
                  {
                    props: {
                      type: 'submit',
                      content: '搜索',
                      status: 'primary'
                    }
                  },
                  { props: { type: 'reset', content: '重置' }}
                ]
              }
            },
            {
              field: 'audit',
              title: '是否审核',
              span: 8,
              folding: true,
              itemRender: {
                name: '$select',
                options: [
                  { label: '是', value: '是' },
                  { label: '否', value: '否' }
                ],
                props: { placeholder: '请选择是否审核' }
              }
            },
            {
              field: 'iSCPZBJ',
              title: '凭证标记',
              span: 8,
              folding: true,
              itemRender: {
                name: '$select',
                options: [
                  { label: '是', value: '是' },
                  { label: '否', value: '否' }
                ],
                props: { placeholder: '请选择凭证标记' }
              }
            },
            {
              field: 'iJEStart',
              title: '金额开始',
              span: 8,
              folding: true,
              itemRender: {
                name: '$input',
                /* props: {
                  type: 'number',
                  min: 1,
                  max: 99999999,
                  placeholder: '请输入金额'
                }, */
                defaultValue: '0.00'
              }
            },
            {
              field: 'iJEEnd',
              title: '金额结束',
              span: 8,
              folding: true,
              itemRender: {
                name: '$input',
                defaultValue: '0.00'
              }
            }
          ]
        },
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_buttons'
          },
          refresh: true,
          /* import: true, */
          export: true,
          print: true,
          /* zoom: true, */
          custom: true
        },
        proxyConfig: {
          seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
          sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
          filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
          form: true, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
          // 对应响应结果 { result: [], page: { total: 100 } }
          props: {
            result: 'data', // 配置响应结果列表字段
            total: 'totalCount' // 配置响应结果总页数字段
          },
          ajax: {
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
              if (queryParams.dDate != null) {
                console.log(queryParams.dDate)
                queryParams.dDate =
                  queryParams.dDate[0] + ',' + queryParams.dDate[1]
              }
              const newQueryParams = Object.assign({}, queryParams)
              delete newQueryParams.pageNum
              delete newQueryParams.pageSize
              sessionStorage.setItem('queryParams', JSON.stringify(newQueryParams))
              console.log(queryParams)
              return fetchList(queryParams)
            }
          }
        },
        columns: [
          { type: 'checkbox', title: 'ID', width: 120 },
          { field: 'cNo', title: '单据编号', width: 140 },
          { field: 'dDate', title: '业务日期', width: 140 },
          { field: 'iYear', title: '会计年度', width: 140 },
          { field: 'iMonth', title: '会计月份', width: 140 },
          { field: 'cDWDM', title: '单位编码', width: 140 },
          { field: 'cDWMC', title: '单位名称', width: 140 },
          { field: 'cZY', title: '摘要', width: 140 },
          { field: 'cKMMC', title: '科目名称', width: 140 },
          { field: 'iJE', title: '金额', width: 140 },
          { field: 'iSCPZBJ', title: '生成凭证标记', width: 140 },
          { field: 'iZXCWPZID', title: '中心财务凭证ID', width: 140 },
          { field: 'iJCCWPZID', title: '基础财务凭证号', width: 140 },
          { field: 'iDQYSJE', title: '当前预算金额', width: 140 },
          { field: 'cYSYear', title: '预算年度', width: 140 },
          { field: 'cPaytypeCode', title: '支付方式编码', width: 140 },
          { field: 'cPayTpe', title: '支付方式', width: 140 },
          { field: 'cYSCode', title: '预算类型编码', width: 140 },
          { field: 'cYS', title: '预算类型', width: 140 },
          { field: 'cZJXZCode', title: '资金性质编码', width: 140 },
          { field: 'cZJXZ', title: '资金性质', width: 140 },
          { field: 'cGNFLCode', title: '功能分类编码', width: 140 },
          { field: 'cGNFL', title: '功能分类', width: 140 },
          {
            field: 'handle',
            title: '操作',
            width: 270,
            fixed: 'right',
            slots: {
              // 对应自定义插槽的名称
              default: 'handle_default'
            }
          }
        ],
        exportConfig: {
        },
        checkboxConfig: {
          labelField: 'id',
          reserve: true,
          highlight: true,
          range: true
        },
        editRules: {
          name: [
            { required: true, message: 'app.body.valid.rName' },
            { min: 3, max: 50, message: '名称长度在 3 到 50 个字符' }
          ],
          email: [{ required: true, message: '邮件必须填写' }],
          role: [{ required: true, message: '角色必须填写' }]
        },
        editConfig: {
          trigger: 'click',
          mode: 'row',
          showStatus: true
        }
      }
    }
  },
  computed: {},
  created() {
    // this.findSexList()
  },
  methods: {
    /* async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    }, */
    findSexList() {
      setTimeout(() => {
        const sexList = [
          { label: '', value: '' },
          { label: '男', value: '1' },
          { label: '女', value: '0' }
        ]
        // 异步更新下拉选项
        this.sexList = sexList
        const $grid = this.$refs.xGrid
        if ($grid) {
          const sexColumn = $grid.getColumnByField('sex')
          sexColumn.editRender.options = sexList
          const sexItem = $grid.getFormItems(4)
          sexItem.itemRender.options = sexList
        }
      }, 100)
    },
    formatAmount({ cellValue }) {
      return cellValue
        ? `￥${XEUtils.commafy(XEUtils.toNumber(cellValue), { digits: 2 })}`
        : ''
    },
    formatDate({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
    },
    checkColumnMethod({ column }) {
      if (['nickname', 'role'].includes(column.property)) {
        return false
      }
      return true
    },
    // 重置方法
    handleFormReset() {
      console.log('表格重置')
      this.$refs.xGrid.commitProxy('reload')
    },
    // 表格双击事件
    cellDBLClickEvent({ row, column }) {
      console.log(row.pk)
      this.$router.push({ path: `/edit/${row.pk}` })
    },
    // 删除表格数据
    handleDelete(row) {
      deleteList({ 'pk': row.pk }).then(() => {
        this.$refs.xGrid.commitProxy('reload')
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style type="css" scoped>
</style>
