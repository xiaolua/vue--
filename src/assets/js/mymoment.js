// 这里是时间戳转换为时间的插件
import moment from 'moment'
let mymoment = {}

mymoment.install = function(Vue){
    // value是要转换的值 sptStr是要转换的格式
    Vue.filter('mymoment',function(value,sptStr){
        return moment(value).format(sptStr)
    })
}
// 暴露
export default mymoment