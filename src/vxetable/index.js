import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'
import Vue from 'vue'

// 创建一个表单-输入框渲染器-双日期
VXETable.renderer.add('DatePicker', {
  // 项显示模板
  renderItem(h, renderOpts, params) {
    const { data, property } = params
    const props = renderOpts.props || {}
    return [
      <el-date-picker
        v-model={ data[property] } { ...{ props } }
        type='datetimerange'
        range-separator='至'
        start-placeholder='开始日期'
        end-placeholder='结束日期'
        value-format='yyyy-MM-dd'
        format='yyyy 年 MM 月 dd 日'
      >
      </el-date-picker>
    ]
  }
})
// 创建一个表单-输入框渲染器-日期年
VXETable.renderer.add('DateYearPicker', {
  // 项显示模板
  renderItem(h, renderOpts, params) {
    const { data, property } = params
    const props = renderOpts.props || {}
    return [
      <el-date-picker
        v-model={ data[property] } { ...{ props } }
        type='year'
        rplaceholder='选择年份'
        format='yyyy 年'
        value-format='yyyy'>
      </el-date-picker>
    ]
  }
})
// 创建一个表单-输入框渲染器-日期月
VXETable.renderer.add('DateMonthPicker', {
  // 项显示模板
  renderItem(h, renderOpts, params) {
    const { data, property } = params
    const props = renderOpts.props || {}
    return [
      <el-date-picker
        v-model={ data[property] } { ...{ props } }
        type='month'
        rplaceholder='选择月份'
        format='MM 月'
        value-format='MM'>
      </el-date-picker>
    ]
  }
})
// 创建一个空内容渲染器
VXETable.renderer.add('NotData', {
  // 空内容模板
  renderEmpty(h, renderOpts) {
    return [
      <span>
        <img src='./images/no_data.gif'/>
        <p>空数据!</p>
      </span>
    ]
  }
})

// 截取小数,默认两位数
VXETable.formats.add('formatCutNumber', ({ cellValue }, digits) => {
  return XEUtils.commafy(cellValue, { digits: digits || 4 })
})
// 自定义全局的格式化处理函--审核状态
VXETable.formats.add('formatStatus', ({ cellValue }) => {
  return cellValue === '1' ? '已审核' : '未审核'
})
// 自定义全局的格式化处理函数--需求状态
VXETable.formats.add('formatPlanStatus', ({ cellValue }) => {
  return cellValue === 1 ? '计划中' : '生产需求'
})
// 自定义全局的格式化处理函数--展示状态
VXETable.formats.add('formatShowStatus', ({ cellValue }) => {
  return cellValue === '0' ? '展示' : '不展示'
})
// 自定义全局的格式化处理函数--展开状态
VXETable.formats.add('formatExtendedStatus', ({ cellValue }) => {
  return cellValue === '1' ? '已展开' : '未展开'
})

// 自定义全局的格式化处理函数--计划状态
VXETable.formats.add('formatFormStatus', ({ cellValue }) => {
  switch (cellValue) {
    case '0':
      return '已中止'
    case '1':
      return '计划中'
    case '2':
      return '已评审'
    case '3':
      return '待排产'
    case '4':
      return '已排产'
    case '5':
      return '已投产'
    case '6':
      return '已派工'
    case '7':
      return '暂停'
    case '8':
      return '生产中'
    case '9':
      return '报工中'
    case '10':
      return '已完工'
    case '11':
      return '入库中'
    case '12':
      return '入库完成'
    case '13':
      return '已关闭'
    case '14':
      return '派工中'
    case '15':
      return '生产完成'
    case '16':
      return '报工完成'
    case '17':
      return '交接完成'
    default:
      return '未知状态'
  }
})

// 自定义全局的格式化处理函数--工序状态
VXETable.formats.add('formatGongxuStatus', ({ cellValue }) => {
  switch (cellValue) {
    case '0':
      return '停用'
    case '1':
      return '待排产'
    case '2':
      return '已排产'
    case '3':
      return '已投产'
    case '4':
      return '已派工'
    case '5':
      return '已领工'
    case '6':
      return '生产中'
    case '7':
      return '已开工'
    case '8':
      return '已开工'
    case '9':
      return '已报工'
    case '10':
      return '已质检'
    case '11':
      return '返工'
    case '12':
      return '入库成功'
    case '13':
      return '入库失败'
    case '14':
      return '已质检'
    case '15':
      return '交接成功'
    default:
      return '未知状态'
  }
})

// 自定义全局的格式化处理函数--设备状态
VXETable.formats.add('formatSheBeiStatus', ({ cellValue }) => {
  switch (cellValue) {
    case 0:
      return '正常'
    case 1:
      return '运行中'
    case 2:
      return '维修'
    case 3:
      return '报废'
    case 4:
      return '已停用'
    default:
      return '未知状态'
  }
})

// 自定义全局的格式化处理函数
VXETable.formats.add('formatDate', ({ cellValue }) => {
  //   return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
  return XEUtils.toDateString(cellValue * 1000, 'yyyy-MM-dd HH:mm:ss')
})
// 自定义全局的格式化处理函数
VXETable.formats.add('formatDateS', ({ cellValue }) => {
  //   return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
  return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
})
// 自定义全局的格式化处理函数-装框状态
VXETable.formats.add('formatDateZK', ({ cellValue }) => {
  switch (cellValue) {
    case 0:
      return '有效'
    case 1:
      return '无效'
    default:
      return '未知状态'
  }
})

// 定义全局过滤器--时间格式化
Vue.filter('formatVueDate', function(val, arg) {
  if (!val) return ''
  //   val = val.toString()
  return val * 1000
})
// 定义全局过滤器--工序状态
Vue.filter('formatVueGx', function(cellValue, arg) {
  switch (cellValue) {
    case '0':
      return '停用'
    case '1':
      return '待排产'
    case '2':
      return '已排产'
    case '3':
      return '已投产'
    case '4':
      return '已派工，待领工'
    case '5':
      return '已领工，待领料'
    case '6':
      return '已领料，待开工'
    case '7':
      return '已开工，待完工'
    case '8':
      return '已完工，待报工'
    case '9':
      return '已报工，待质检'
    case '10':
      return '已质检，待入库'
    case '11':
      return '返工'
    case '12':
      return '入库成功'
    case '13':
      return '入库失败'
    default:
      return '未知状态'
  }
})

