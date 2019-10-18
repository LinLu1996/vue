/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/todoList', component: _import('common/todoList'), name: 'todoList', meta: { title: '待办事项' } },
    { path: '/doList', component: _import('common/doList'), name: 'doList', meta: { title: '已办事项' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/carrierAdd', component: _import('modules/trans-resources/carrier/carrier-add-or-update'), name: 'carrierAdd', meta: { title: '新增' } },
    { path: '/carrierDetail', component: _import('modules/trans-resources/carrier/carrier-detail'), name: 'carrierDetail', meta: { title: '详情' } },
    { path: '/carrierRoad', component: _import('modules/trans-resources/carrier/carrier-road'), name: 'carrierRoad', meta: { title: '路线' } },
    { path: '/carMaintenance', component: _import('modules/trans-resources/car/car-maintenance'), name: 'carMaintenance', meta: { title: '维保记录' } },
    { path: '/car/car-add-or-update', component: _import('modules/trans-resources/car/car-add-or-update'), name: 'car-add-or-update', meta: { title: '新增编辑' } },
    { path: '/contract/contract-add-or-update', component: _import('modules/trans-resources/contract/contract-add-or-update'), name: 'contract-add-or-update', meta: { title: '新增编辑' } },
    { path: '/carrier-area/area-add-or-update', component: _import('modules/trans-resources/carrier-area/area-add-or-update'), name: 'area-add-or-update', meta: { title: '新增编辑' } },
    { path: '/carrier-area/area-detail', component: _import('modules/trans-resources/carrier-area/area-details'), name: 'area-details', meta: { title: '详情' } },
    { path: '/contract/agreement-add', component: _import('modules/trans-resources/contract/agreement-add'), name: 'agreement-add', meta: { title: '添加补充协议' } },
    { path: '/contract/agreement-details', component: _import('modules/trans-resources/contract/agreement-details'), name: 'agreement-details', meta: { title: '补充协议详情' } },
    { path: '/business-license/business-add-or-update', component: _import('modules/trans-resources/business-license/business-add-or-update'), name: 'business-add-or-update', meta: { title: '新增编辑' } },
    { path: '/trans-certificate/certificate-add-or-update', component: _import('modules/trans-resources/trans-certificate/certificate-add-or-update'), name: 'certificate-add-or-update', meta: { title: '新增编辑' } },
    { path: '/trans-products/products-add-or-update', component: _import('modules/trans-resources/trans-products/products-add-or-update'), name: 'products-add-or-update', meta: { title: '新增编辑' } },
    { path: '/perform-management-perform-appraisal/exam-template/template-add', component: _import('modules/perform-management/perform-appraisal/exam-template/template-add'), name: 'template-add', meta: { title: '新增模板' } },
    { path: '/perform-management-perform-appraisal/exam-template/template-view', component: _import('modules/perform-management/perform-appraisal/exam-template/template-view'), name: 'template-view', meta: { title: '模板预览' } },
    { path: '/perform-management-perform-appraisal/exam-template/template-view', component: _import('modules/perform-management/examinationRecord/template-view'), name: 'examination-template-view', meta: { title: '模板预览' } },
    { path: '/trans-resources/delegate-record/for-record', component: _import('modules/trans-resources/delegate-record/for-record'), name: 'for-record', meta: { title: '新增备案' } },
    { path: '/trans-resources/delegate-record/record-list', component: _import('modules/trans-resources/delegate-record/record-list'), name: 'record-list', meta: { title: '备案列表' } },
    { path: '/trans-resources/product/product-list', component: _import('modules/trans-resources/product/product-list'), name: 'product-list', meta: { title: '产品列表' } },
    { path: '/carrier-line/line-add-or-update', component: _import('modules/trans-resources/carrier-line/line-add-or-update'), name: 'line-add-or-update', meta: { title: '新增编辑' } },
    { path: '/cost-settlement/cargo-damage/shipper-details', component: _import('modules/cost-settlement/cargo-damage/shipper-details'), name: 'shipper-details', meta: { title: '货主明细' } },
    { path: '/trans-resources/product/product-list', component: _import('modules/trans-resources/product/product-list'), name: 'product-list', meta: { title: '产品列表' } },
    { path: '/cost-settlement-cost/cost/cost-detail', component: _import('modules/cost-settlement/cost/cost-detail'), name: 'cost-detail', meta: { title: '对账明细' } },
    { path: '/cost-settlement-cost/invoice/invoice-add-or-update', component: _import('modules/cost-settlement/invoice/invoice-add-or-update'), name: 'invoice-add', meta: { title: '开票新增' } },
    { path: '/cost-settlement-cost/invoice/invoice-choice', component: _import('modules/cost-settlement/invoice/invoice-choice'), name: 'invoice-add', meta: { title: '开票新增' } },
    { path: '/cost-settlement-cost/invoice/invoice-detail', component: _import('modules/cost-settlement/invoice/invoice-detail'), name: 'invoice-detail', meta: { title: '开票详情' } },
    { path: '/cost-settlement-cost/invoice/invoice-examine', component: _import('modules/cost-settlement/invoice/invoice-examine'), name: 'invoice-examine', meta: { title: '开票审核' } },
    { path: '/cost-settlement-cost/invoice/invoice-off', component: _import('modules/cost-settlement/invoice/invoice-off'), name: 'invoice-off', meta: { title: '付款核销' } },
    { path: '/cost-settlement-cost/cargo-damage/detail', component: _import('modules/detailList/cargo-damage-details'), name: 'cargo-damage-details', meta: { title: '货损单明细' } }
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
