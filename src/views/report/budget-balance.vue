<template>
  <div class="app-container">
    <!-- <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="单位代码" prop="dw">
        <el-input v-model="ruleForm.dw" />
      </el-form-item>
      <el-form-item label="月份" prop="month">
        <el-input v-model="ruleForm.month" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">查询</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form> -->
    <!-- 表格 -->
    <vxe-grid ref="xGrid" v-bind="gridOptions" @form-reset="handleFormReset" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import XEUtils from 'xe-utils'
import { fetchList } from '@/api/budget-balance'

export default {
  name: 'BudgetBalance',
  components: {},
  data() {
    return {
      ruleForm: {
        dw: '',
        month: ''
      },
      rules: {
        dw: [{ required: true, message: '请输入单位代码', trigger: 'blur' }],
        month: [{ required: true, message: '请输入查询月份', trigger: 'blur' }]
      },
      gridOptions: {
        stripe: true,
        border: true,
        resizable: true,
        showHeaderOverflow: true,
        showOverflow: true,
        highlightHoverRow: true,
        keepSource: true,
        id: 'full_edit_1',
        height: 600,
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
          pageSize: 100,
          pageSizes: [100, 200, 500]
        },
        formConfig: {
          titleWidth: 100,
          titleAlign: 'right',
          items: [
            {
              field: 'dw',
              title: '单位代码',
              span: 8,
              itemRender: {
                name: '$input',
                defaultValue: ''
              }
            },
            {
              field: 'month',
              title: '月份',
              span: 10,
              itemRender: {
                name: '$input',
                props: { type: 'month', placeholder: '请输入月份' },
                defaultValue: new Date()
              }
            },
            {
              span: 6,
              align: 'center',
              //   collapseNode: true,
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
            }
          ]
        },
        toolbarConfig: {
          /* slots: {
            buttons: 'toolbar_buttons'
          },
          refresh: true,
          export: true,
          print: true,
          custom: true */
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

              //   queryParams.month = queryParams.month.slice(0, 7)
              console.log(queryParams)
              return fetchList(queryParams)
            }
          }
        },
        columns: [
          { field: 'cUnitCode', title: '用款单位编码', width: 120 },
          { field: 'cUnitName', title: '用款单位名称', width: 160 },
          { field: 'cClass', title: '预算类型', width: 120 },
          { field: 'cYSCode', title: '预算科目编码', width: 140 },
          { field: 'cYSName', title: '预算科目名称' },
          { field: 'qc', title: '期初', width: 120 },
          { field: 'bzMoney', title: '报账金额', width: 120 },
          { field: 'ysMoney', title: '预算金额', width: 120 },
          { field: 'ye', title: '余额 ', width: 120 }
        ],
        exportConfig: {},
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
  computed: {
    ...mapGetters(['unitCode'])
  },
  created() {
    // this.findSexList()
    // this.ruleForm.dw = this.unitCode
    this.gridOptions.formConfig.items[0].itemRender.defaultValue =
      this.unitCode
  },
  methods: {
    /* async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    }, */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.xGrid.commitProxy('reload')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
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
      console.log(this.unitCode)
      this.$refs.xGrid.commitProxy('reload')
    }
  }
}
</script>

<style type="css" scoped>
</style>
