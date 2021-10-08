<template>
  <div class="app-container">
    <div ref="fixBox" class="fix-box">
      <!-- 按钮 -->
      <el-row class="top-btn">
        <!-- <el-button type="primary" size="mini">新增</el-button>
      <el-button type="success" size="mini">复制表头</el-button>
      <el-button type="info" size="mini">修改</el-button> -->
        <el-button
          type="success"
          size="mini"
          @click="submitForm"
        >保存</el-button>
        <!-- <el-button type="danger" size="mini">放弃</el-button> -->
        <el-button-group class="top-btn-group">
          <el-button
            type="primary"
            size="mini"
            :disabled="!isEdit"
            @click="firstPage"
          >首张</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="!isEdit"
            @click="prePage"
          >上张</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="!isEdit"
            @click="nextPage"
          >下张
          </el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="!isEdit"
            @click="lastPage"
          >末张</el-button>
        </el-button-group>
        <el-button
          class="top-btn-group"
          type="warning"
          size="mini"
          @click="onShowForm()"
        >
          <span v-show="formFlag">折叠</span>
          <span v-show="!formFlag">展开</span>
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="insertEvent(-1)"
        >增行</el-button>
        <el-popconfirm
          icon="el-icon-info"
          title="确定删除此行数据吗？"
          icon-color="#409EFF"
          confirm-button-text="确定"
          cancel-button-text="取消"
          class="pop-btn-del"
          @onConfirm="removeRowEvent()"
          @onCancel="() => {}"
        >
          <el-button slot="reference" size="mini" type="danger">
            删行</el-button>
        </el-popconfirm>
      </el-row>
      <!-- 表单 -->
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="100px"
        :inline="true"
        size="mini"
        class="form-inline"
      >
        <!-- <el-form-item label="设备分类" prop="code">
        <el-select
          v-model="temp.categoryid"
          clearable
          class="filter-item"
          placeholder="请选择设备分类"
        >
          <el-option
            v-for="item in treeTypeOptions"
            :key="item.id"
            :label="item.classificationName"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->

        <el-form-item label="单据编号" prop="cNo">
          <el-input v-model="temp.cNo" :disabled="true" />
        </el-form-item>
        <el-form-item label="业务日期" prop="dDate">
          <el-date-picker
            v-model="temp.dDate"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="摘要" prop="zy">
          <el-input v-model="temp.zy" />
        </el-form-item>
        <!-- <el-form-item label="科目编码" prop="kmbm">
        <el-input v-model="temp.kmbm" />
      </el-form-item> -->

        <!-- <el-form-item label="科目名称" prop="kmmc">
        <el-input v-model="temp.kmmc" />
      </el-form-item> -->

        <!-- 单位代码 -->
        <reference-unit
          ref="ReferenceUnit"
          :temp="temp"
          @enlarge-text="onReferenceUnitText"
        />
        <el-form-item label="单位名称" prop="dwmc">
          <el-input v-model="temp.dwmc" :disabled="true" />
        </el-form-item>
        <el-form-item label="报账人" prop="bzr">
          <el-input v-model="temp.bzr" :disabled="true" />
        </el-form-item>
        <el-form-item label="单位经办人" prop="dwjbr">
          <el-input v-model="temp.dwjbr" :disabled="true" />
        </el-form-item>

        <el-form-item v-show="formFlag" label="收付类型" prop="sfType">
          <el-select
            v-model="temp.sfType"
            clearable
            class="filter-item"
            placeholder="请选择收付类型"
          >
            <el-option
              v-for="item in sfTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="formFlag" label="凭证类型" prop="pzType">
          <el-input v-model="temp.pzType" />
        </el-form-item>
        <el-form-item v-show="formFlag" label="贷方金额" prop="dfAmount">
          <el-input v-model="temp.dfAmount" />
        </el-form-item>
        <el-form-item v-show="formFlag" label="是否审核" prop="isAudit">
          <el-select
            v-model="temp.isAudit"
            clearable
            class="filter-item"
            placeholder="请选择是否审核"
          >
            <el-option
              v-for="item in auditTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="formFlag" label="中心经办人" prop="centerJBR">
          <el-input v-model="temp.centerJBR" :disabled="true" />
        </el-form-item>
        <!-- <el-form-item label="单位类别" prop="dwlb">
        <el-input v-model="temp.dwlb" />
      </el-form-item> -->
        <el-form-item v-show="formFlag" label="生成凭证标记" prop="scpzFlag">
          <el-input v-model="temp.scpzFlag" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="formFlag" label="制单人" prop="maker">
          <el-input v-model="temp.maker" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="formFlag" label="制单日期" prop="makeDate">
          <el-date-picker
            v-model="temp.makeDate"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item v-show="formFlag" label="审核人" prop="auditor">
          <el-input v-model="temp.auditor" :disabled="true" />
        </el-form-item>
        <el-form-item v-show="formFlag" label="审核日期" prop="auditDate">
          <el-date-picker
            v-model="temp.auditDate"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder=""
            :disabled="true"
          />
        </el-form-item>
        <!-- <el-form-item>
        <el-button type="primary" @click="onShowForm()">
          <span v-show="formFlag">折叠</span>
          <span v-show="!formFlag">展开</span>
        </el-button>
      </el-form-item> -->
      </el-form>
    </div>

    <!-- 表格 -->
    <div id="xGridTable">
      <vxe-grid
        ref="xGrid"
        v-bind="gridOptions"
        class="vxe-table sortable-column-demo"
      >
        <!--科目预算参照-->
        <template v-slot:search_default="{ row }">
          <el-row :gutter="20">
            <!-- <el-col :span="12">
            {{ row.km }}
          </el-col> -->
            <el-col :span="24">
              <single-weight
                ref="SingleWeight"
                :row="row"
                @enlarge-text="onSingleWeightText"
              />
            </el-col>
          </el-row>
        </template>
        <!--指标信息参照-->
        <template v-slot:zhibiao_default="{ row }">
          <el-row :gutter="20">
            <!-- <el-col :span="12">
            {{ row.yszbdh }}
          </el-col> -->
            <el-col :span="24">
              <index-information
                ref="IndexInformation"
                :row="row"
                :condition="temp.dwdm"
                :subject="row.yskmbm"
                @enlarge-text="onIndexInformationText"
              />
            </el-col>
          </el-row>
        </template>
        <template v-slot:year_default="{ row }">
          <el-date-picker
            v-model="row.kjYear"
            type="year"
            placeholder="选择年"
            format="yyyy 年"
            value-format="yyyy"
          />
        </template>
        <template v-slot:month_default="{ row }">
          <el-date-picker
            v-model="row.kjMonth"
            type="month"
            placeholder="选择月"
            format="MM 月"
            value-format="MM"
          />
        </template>
        <template #toolbar_buttons>
          <!-- <vxe-button @click="insertEvent(-1)">增行</vxe-button>
        <el-popconfirm
          icon="el-icon-info"
          title="确定删除此行数据吗？"
          icon-color="#409EFF"
          confirm-button-text="确定"
          cancel-button-text="取消"
          class="pop-btn-del"
          @onConfirm="removeRowEvent()"
          @onCancel="() => {}"
        >
          <vxe-button slot="reference" type="danger"> 删行</vxe-button>
        </el-popconfirm> -->
        </template>
        <!-- 菜单 -->
        <!-- <template #operate="{ row }">
        <el-popconfirm
          icon="el-icon-info"
          title="确定删除此行数据吗？"
          icon-color="#409EFF"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @onConfirm="removeRowEvent(row)"
          @onCancel="()=>{}"
        >
          <el-button slot="reference" type="danger" icon="fa fa-trash" size="small"> 删除</el-button>
        </el-popconfirm>
      </template> -->
      </vxe-grid>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sortable from 'sortablejs'
import XEUtils from 'xe-utils'
import SingleWeight from '@/views/components-imes/single-weight'
import IndexInformation from '@/views/components-imes/index-information'
import ReferenceUnit from '@/views/components-imes/reference-unit'
// import { getRoutes, getRoles,getSelectDate } from "@/api/role";
import { fetchAdd, fetchEdit } from '@/api/bzd-add'

/*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/
Date.prototype.Format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

const defaultForm = {
  cNo: '',
  dDate: new Date().Format('yyyy-MM-dd'),
  zy: '',
  //   kmbm: '',
  //   kmmc: '',
  dwdm: '',
  dwmc: '',
  bzr: '',
  dwjbr: '',
  sfType: '付款',
  pzType: '财',
  dfAmount: '',
  isAudit: '否',
  centerJBR: '',
  //   dwlb: '',
  scpzFlag: '',
  maker: '',
  makeDate: new Date().Format('yyyy-MM-dd'),
  auditor: '',
  auditDate: '',
  lists: []
}

export default {
  name: 'ReimbursementDetail',
  components: { SingleWeight, ReferenceUnit, IndexInformation },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formFlag: false,
      temp: Object.assign({}, defaultForm),
      currentPageNum: '0',
      firstPageNum: '1',
      prevPageNum: '2',
      nextPageNum: '3',
      lastPageNum: '4',
      rules: {
        dwdm: [{ required: true, message: '请选择单位代码', trigger: 'blur' }],
        zy: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      },
      treeTypeOptions: [],
      sfTypeOptions: [
        { name: '收款', value: '收款' },
        { name: '付款', value: '付款' }
      ],
      auditTypeOptions: [
        { name: '是', value: '是' },
        { name: '否', value: '否' }
      ],
      pageNum: null,
      gridOptions: {
        stripe: true,
        border: true,
        columnKey: true,
        scrollX: {
          enabled: false
        },
        resizable: true,
        showHeaderOverflow: true,
        showOverflow: true,
        highlightHoverRow: true,
        keepSource: true,
        id: 'full_edit_1',
        height: 400,
        rowId: 'autoId',
        data: [],
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
          pageSizes: [10, 20, 50, 100, 500]
        },
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_buttons'
          }
          //   buttons: [
          //     { code: 'insert_actived', name: '增行', icon: 'fa fa-plus' },
          //     // <el-button type="primary" @click="submitForm()">保存</el-button>
          //     { code: 'delete', name: '保存', icon: 'fa fa-floppy-o' }

          //   ]
        },
        proxyConfig: {
          seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
          sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
          filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
          // 对应响应结果 { result: [], page: { total: 100 } }
          props: {
            result: 'result', // 配置响应结果列表字段
            total: 'page.total' // 配置响应结果总页数字段
          },
          ajax: {
            // 任何支持 Promise API 的库都可以对接（fetch、jquery、axios、xe-ajax）
            //   query: ({ page }) => fetchList(page.currentPage, page.pageSize),
            //   query: ({ page }) => fetchList(this.listQuery),
            // 接收 Promise 对象
            query: ({ page, form }) => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  const list = this.temp.lists
                  resolve({
                    page: {
                      total: list.length
                    },
                    result: list.slice(
                      (page.currentPage - 1) * page.pageSize,
                      page.currentPage * page.pageSize
                    )
                  })
                }, 1000)
              })
            }
          }
        },
        columns: [
          {
            type: 'checkbox',
            title: '序号',
            field: 'autoId',
            width: 100,
            fixed: 'left'
          },
          //   { type: 'seq', width: 40, fixed: 'left' },
          //   {
          //     field: 'autoId',
          //     title: '序号',
          //     width: 80
          //     // visible: false
          //   },
          //   { title: '操作', width: 100, slots: { default: 'operate' }},
          {
            field: 'km',
            title: '科目编码',
            width: 160,
            align: 'left',
            titleHelp: { message: '请选择科目编码' },
            slots: { default: 'search_default' }
          },
          {
            field: 'kmbmwb',
            title: '科目编码文本',
            width: 140
          },
          {
            field: 'yskmbm',
            title: '预算科目编码',
            width: 140
          },
          /* {
            field: 'role',
            title: 'Role',
            sortable: true,
            filters: [
              { label: '前端开发', value: '前端' },
              { label: '后端开发', value: '后端' },
              { label: '测试', value: '测试' },
              { label: '程序员鼓励师', value: '程序员鼓励师' }
            ],
            filterMultiple: false,
            editRender: { name: 'input', attrs: { placeholder: '请输入角色' }}
          },
          {
            field: 'email',
            title: 'Email',
            width: 160,
            editRender: {
              name: '$input',
              props: { placeholder: '请输入邮件' }
            }
          },
          {
            field: 'sex',
            title: 'Sex',
            width: 160,
            filters: [
              { label: '男', value: '1' },
              { label: '女', value: '0' }
            ],
            editRender: {
              name: '$select',
              options: [],
              props: { placeholder: '请选择性别' }
            }
          },
          {
            field: 'age',
            title: 'Age',
            width: 160,
            visible: false,
            sortable: true,
            editRender: {
              name: '$input',
              props: { type: 'number', min: 1, max: 120 }
            }
          }, */
          /* {
            field: 'kjMonth',
            title: '会计月份',
            width: 250,
            slots: { default: 'month_default' }
          },
          {
            field: 'kjYear',
            title: '会计年度',
            width: 250,
            slots: { default: 'year_default' }
          }, */
          //   自定义
          {
            field: 'kmmc',
            title: '科目名称',
            width: 140
          },
          {
            field: 'yskmmc',
            title: '预算科目名称',
            width: 140
          },
          {
            field: 'yszbdh',
            title: '预算指标单号',
            width: 170,
            titleHelp: { message: '请选择指标单号' },
            slots: { default: 'zhibiao_default' }
          },
          {
            field: 'dqysje',
            title: '当前预算金额',
            width: 140
            /* editRender: { name: 'input', defaultValue: '0.00', attrs: { placeholder: '请输入' }} */
          },
          {
            field: 'jdfx',
            title: '借贷方向',
            width: 140,
            filters: [
              { label: '借', value: '借' },
              { label: '贷', value: '贷' }
            ],
            editRender: {
              name: '$select',
              options: [
                { label: '借', value: '借' },
                { label: '贷', value: '贷' }
              ],
              defaultValue: '借',
              props: { placeholder: '请选择借贷方向' }
            }
          },
          {
            field: 'amount',
            title: '金额',
            width: 140,
            // formatter: this.formatAmount,
            editRender: {
              name: '$input',
              //   defaultValue: '0',
              props: { type: 'number', placeholder: '请输入数值' }
            }
          },
          {
            field: 'fjs',
            title: '附件数',
            width: 140,
            editRender: {
              name: 'input',
              defaultValue: '1',
              attrs: { placeholder: '请输入' }
            }
          },
          {
            field: 'ysType',
            title: '预算类型',
            width: 140
          },
          {
            field: 'ysYear',
            title: '预算年度',
            width: 140
          },
          {
            field: 'payType',
            title: '支付方式',
            width: 140
          },
          {
            field: 'zjxz',
            title: '资金性质',
            width: 140
          },
          {
            field: 'gnfl',
            title: '功能分类',
            width: 140
          },
          {
            field: 'jsNo',
            title: '结算单号',
            width: 140,
            editRender: { name: 'input', attrs: { placeholder: '请输入' }}
          },
          {
            field: 'fzDept',
            title: '部门辅助项',
            width: 140,
            editRender: { name: 'input', attrs: { placeholder: '请输入' }}
          },
          {
            field: 'fzWL',
            title: '往来辅助项',
            width: 140,
            editRender: { name: 'input', attrs: { placeholder: '请输入' }}
          },
          {
            field: 'fzPerson',
            title: '个人往来辅助项',
            width: 140,
            editRender: { name: 'input', attrs: { placeholder: '请输入' }}
          },
          {
            field: 'jcAccNo',
            title: '基础账套号',
            width: 140
          },
          {
            field: 'jcYSVouchNo',
            title: '基础预算凭证号',
            width: 140
          },
          {
            field: 'jcCWVouchNo',
            title: '基础财务凭证号',
            width: 140
          },
          {
            field: 'centerYSVouchNo',
            title: '中心预算凭证号',
            width: 140
          },
          {
            field: 'centerCWVouchNo',
            title: '中心财务凭证号',
            width: 140
          },
          {
            field: 'kjMonth',
            title: '会计月份',
            width: 140
          },
          {
            field: 'kjYear',
            title: '会计年度',
            width: 140
          },
          {
            field: 'pzlb',
            title: '凭证类别',
            width: 140
          },
          {
            field: 'fzItem',
            title: '项目辅助项',
            width: 140
          },
          {
            field: 'centerYSVouchID',
            title: '中心预算凭证ID',
            width: 140
          },
          {
            field: 'jcYSVouchID',
            title: '基础预算凭证ID',
            width: 140
          },
          {
            field: 'centerCWVouchID',
            title: '中心财务凭证ID',
            width: 140
          },
          {
            field: 'jcCWVouchID',
            title: '基础财务凭证ID',
            width: 140
          }
        ],
        importConfig: {
          remote: true,
          importMethod: this.importMethod,
          types: ['xlsx'],
          modes: ['insert']
        },
        exportConfig: {
          remote: true,
          exportMethod: this.exportMethod,
          types: ['xlsx'],
          modes: ['current', 'selected', 'all']
        },
        checkboxConfig: {
          labelField: 'autoId',
          reserve: true,
          highlight: true,
          range: true
        },
        editRules: {
          km: [{ required: true, message: '请填写科目编码' }],
          yszbdh: [{ required: true, message: '请填写预算指标单号' }],
          email: [
            { required: true, message: '邮件必须填写' },
            { min: 3, max: 50, message: '名称长度在 3 到 50 个字符' }
          ]
        },
        editConfig: {
          trigger: 'click',
          mode: 'row',
          showStatus: false // 开启新增和编辑状态显示功能
        }
      }
    }
  },
  computed: {
    ...mapGetters(['name']),

    shenHeDate: {
      get() {
        // return +new Date(this.temp.dDate)
        return this.temp.auditDate
      },
      set(val) {
        this.temp.auditDate =
          new Date(val).getFullYear() +
          '-' +
          (new Date(val).getMonth() + 1) +
          '-' +
          new Date(val).getDate()
      }
    }
  },
  created() {
    this.temp.centerJBR = this.name
    this.temp.maker = this.name
    // this.findSexList()
    // 获取路由参数
    if (this.isEdit) {
      const pk = this.$route.params && this.$route.params.pk
      //   const sort = this.$route.params && this.$route.params.sort
      const queryParams = sessionStorage.getItem('queryParams')
      const obj = JSON.parse(queryParams)
      obj.pk = pk
      this.fetchData(obj)
    }
    // 列拖拽
    this.columnDrop2()
    // 自动根据表头高度设置表体位置
    this.$nextTick(() => {
      const fixBox = this.$refs.fixBox
      const xGridTable = document.getElementById('xGridTable')
      // console.log(serachBox)
      const iHeight = fixBox.offsetHeight
      console.log(iHeight)
      xGridTable.style.marginTop = iHeight - 70 + 'px'
    })
  },
  methods: {
    /* async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    }, */
    fetchData(obj) {
      fetchEdit(obj)
        .then((response) => {
          this.temp = response.data
          // 设置当前页ID
          this.currentPageNum = response.data.pk
          // 设置首张、上张、下张、末张ID
          this.firstPageNum = response.data.Page.First
          this.prevPageNum = response.data.Page.Prev
          this.nextPageNum = response.data.Page.Next
          this.lastPageNum = response.data.Page.Last
          this.$refs.xGrid.commitProxy('reload')
          // just for test
          // this.temp.title += `Article Id:${this.postForm.id}`
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 单位
    onReferenceUnitText: function(json) {
      this.temp.dwdm = json.dwdm
      this.temp.dwmc = json.dwmc
      this.temp.bzr = json.bzr
      this.temp.dwjbr = json.jbr
    },
    // 科目
    onSingleWeightText: function(json) {
      console.log(json)
      const parentData = this.$refs.xGrid.getTableData().tableData
      for (var i = 0; i < parentData.length; i++) {
        if (parentData[i].autoId === json.id) {
          parentData[i].km = json.cKM
          parentData[i].kmbmwb = json.cKMBMWB
          parentData[i].yskmbm = json.cYSKMBM
          //   parentData[i].kmmc = json.cKMMC
          parentData[i].yskmmc = json.cYSKMMC
        }
      }
      this.dialogVisible = false
    },

    // 指标
    onIndexInformationText: function(json) {
      const parentData = this.$refs.xGrid.getTableData().tableData
      for (var i = 0; i < parentData.length; i++) {
        if (parentData[i].autoId === json.id) {
          parentData[i].yszbdh = json.yszbNo
          parentData[i].dqysje = json.dqysje
          parentData[i].ysType = '[' + json.ysTypeCode + ']' + json.ysType
          parentData[i].ysYear = json.ysYear
          parentData[i].payType = '[' + json.payTypeCode + ']' + json.payType
          parentData[i].zjxz = '[' + json.zjxzCode + ']' + json.zjxz
          parentData[i].gnfl = '[' + json.gnflCode + ']' + json.gnfl
        }
      }
      this.dialogVisible = false
    },

    // 增行
    insertEvent(row) {
      const grid = this.$refs.xGrid
      /* grid.insert({
        amount: ''
      }) */
      const record = {
        amount: ''
      }
      const { row: newRow } = grid.insertAt(record, row)
      grid.setActiveCell(newRow, 'km')
    },

    // 删行
    removeRowEvent(row) {
      //   console.log(row)
      //   this.$refs.xGrid.remove(row)
      const selectRecords = this.$refs.xGrid.getCheckboxRecords()
      console.log(selectRecords)
      this.$refs.xGrid.remove(selectRecords)
    },

    // 提交
    submitForm() {
      if (this.isEdit) {
        if (this.temp.auditor) {
          this.$notify({
            title: '失败',
            message: '已审核,保存失败',
            type: 'error',
            duration: 2000
          })
          return false
        }
      }
      const tableList = this.$refs.xGrid.getTableData().tableData
      this.temp.lists = tableList
      console.log(tableList)
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          for (var i = 0; i < tableList.length; i++) {
            // tableList[i].autoId = (tableList[i].id).slice(4)
            if (parseInt(tableList[i].dqysje) < parseInt(tableList[i].amount)) {
              this.$message.error(
                '序号为' +
                  tableList[i].autoId +
                  '的当前预算金额必须大于等于金额！'
              )
              return false
            }
            
            if (tableList[i].ysType === null) {
              this.$message.error(
                '序号为' + tableList[i].autoId + '预算类型不能为空！'
              )
              return false
            }
            if (tableList[i].km === null) {
              this.$message.error(
                '序号为' + tableList[i].autoId + '表体科目编码必填！'
              )
              return false
            }
            if (tableList[i].amount === '') {
              this.$message.error(
                '序号为' + tableList[i].autoId + '表体金额必填！'
              )
              return false
            }
          }
          console.log(JSON.stringify(this.temp))
          //   添加
          fetchAdd(this.temp).then((response) => {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
            this.temp = Object.assign({}, defaultForm)
            // this.$refs.xGrid.clearData()
            // this.$refs.xGrid.clearAll()
            this.$refs.xGrid.remove()
          })
        } else {
          console.log('error submit!!')
          this.$message({
            message: '验证不通过，请输入表单必填项',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 首张
    firstPage() {
      const queryParams = sessionStorage.getItem('queryParams')
      const obj = JSON.parse(queryParams)
      obj.pk = this.firstPageNum
      this.fetchData(obj)
    },
    // 上一张
    prePage() {
      if (this.currentPageNum === this.prevPageNum) {
        this.$message({
          message: '已经是第一张啦',
          type: 'warning'
        })
        return
      }
      const queryParams = sessionStorage.getItem('queryParams')
      const obj = JSON.parse(queryParams)
      obj.pk = this.prevPageNum
      this.fetchData(obj)
    },
    // 下一张
    nextPage() {
      /* this.$router.push({
        name: 'EditReimbursement',
        params: { pk: this.pageNum, sort: 'next' }
      }) */
      if (this.currentPageNum === this.nextPageNum) {
        this.$message({
          message: '已经是最后一张啦',
          type: 'warning'
        })
        return
      }
      const queryParams = sessionStorage.getItem('queryParams')
      const obj = JSON.parse(queryParams)
      obj.pk = this.nextPageNum
      this.fetchData(obj)
    },
    // 末张
    lastPage() {
      const queryParams = sessionStorage.getItem('queryParams')
      const obj = JSON.parse(queryParams)
      obj.pk = this.lastPageNum
      this.fetchData(obj)
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
          /* const sexItem = $grid.getFormItems(4)
          sexItem.itemRender.options = sexList */
        }
      }, 100)
    },
    formatAmount({ cellValue }) {
      return '￥' + cellValue
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
    // 获取表格下拉框
    fetchSelect() {
      /* getSelectDate().then((res) => {
        this.treeTypeOptions = res.data
        console.log('成功获取设备信息')
      }) */
    },
    // form展开折叠
    onShowForm() {
      this.formFlag = !this.formFlag
      this.$nextTick(() => {
        const fixBox = this.$refs.fixBox
        const xGridTable = document.getElementById('xGridTable')
        // console.log(serachBox)
        const iHeight = fixBox.offsetHeight
        console.log(iHeight)
        xGridTable.style.marginTop = iHeight - 70 + 'px'
      })
    },
    // 列可拖拽
    columnDrop2() {
      this.$nextTick(() => {
        const $table = this.$refs.xGrid
        this.sortable2 = Sortable.create(
          $table.$el.querySelector(
            '.body--wrapper>.vxe-table--header .vxe-header--row'
          ),
          {
            handle: '.vxe-header--column:not(.col--fixed)',
            onEnd: ({ item, newIndex, oldIndex }) => {
              const { fullColumn, tableColumn } = $table.getTableColumn()
              const targetThElem = item
              const wrapperElem = targetThElem.parentNode
              const newColumn = fullColumn[newIndex]
              if (newColumn.fixed) {
                // 错误的移动
                if (newIndex > oldIndex) {
                  wrapperElem.insertBefore(
                    targetThElem,
                    wrapperElem.children[oldIndex]
                  )
                } else {
                  wrapperElem.insertBefore(
                    wrapperElem.children[oldIndex],
                    targetThElem
                  )
                }
                return this.$XModal.message({
                  content: '固定列不允许拖动！',
                  status: 'error'
                })
              }
              // 转换真实索引
              const oldColumnIndex = $table.getColumnIndex(
                tableColumn[oldIndex]
              )
              const newColumnIndex = $table.getColumnIndex(
                tableColumn[newIndex]
              )
              // 移动到目标列
              const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
              fullColumn.splice(newColumnIndex, 0, currRow)
              $table.loadColumn(fullColumn)
            }
          }
        )
      })
    }
  }
}
</script>

<style type="text/css" scoped>
.fix-box {
  position: fixed;
  top: 84px;
  display: block;
  background: #fff;
  z-index: 2000;
}
.top-btn {
  padding-top: 10px;
}
.form-inline >>> .el-form-item--mini.el-form-item {
  margin-bottom: 12px;
}
.vxe-table >>> .vxe-table--render-default .vxe-body--column.col--ellipsis,
.vxe-table >>> .vxe-table--render-default.vxe-editable .vxe-body--column,
.vxe-table >>> .vxe-table--render-default .vxe-footer--column.col--ellipsis,
.vxe-table >>> .vxe-table--render-default .vxe-header--column.col--ellipsis {
  height: 34px;
}
.vxe-table >>> .components-wrapper {
  display: block;
}
.vxe-table >>> .el-button--small {
  padding: 4px 15px;
}
.top-btn {
  margin-bottom: 10px;
}
.top-btn-group {
  margin-left: 10px;
}
.pop-btn-del {
  margin-left: 10px;
}
</style>
<style type="text/css">
.sortable-column-demo {
  margin-top: 60px;
}
.sortable-column-demo .vxe-header--row .vxe-header--column.sortable-ghost,
.sortable-column-demo .vxe-header--row .vxe-header--column.sortable-chosen {
  background-color: #dfecfb;
}
.sortable-column-demo .vxe-header--row .vxe-header--column.col--fixed {
  cursor: no-drop;
}
.vxe-table--render-default .vxe-cell--radio .vxe-radio--icon:before {
  border: 2px solid #98ccfc;
}
</style>
