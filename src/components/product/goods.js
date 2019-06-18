import BreadNav from "../breadnav/breadnav.vue";
import Vue from 'vue'
import moment from 'moment'
  Vue.filter('dateformat',function(dataStr,pattern='YYYY-MM-DD hh:mm:ss'){
    if(dataStr){
      return moment(dataStr).format(pattern)
    }else{
      return dataStr
    }
  })
export default {
  // 时间戳的全局过滤器

  data() {
    return {
      search: "",
      ProductTableData: [],
      currentPage:1,//默认当前页
      pagesize: 5, // 默认页容量
      formObj: {
        // 表单元素中的数据
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addDialog: false, // 控制新增对话框的显示和隐藏
      EditDialog: false, // 控制编辑对话框的显示和隐藏
      roleDialog: false, // 控制角色对话框的显示和隐藏
      formLabelWidth: "100px", // 文本的宽度
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      options: [],
      total:0,
      pageSizes:[5,10,15],
      pageSize:5
    };
  },
  methods: {
    // 获取页面的列表
    getAllProduct() {
      this.$http
        .get(`goods`, {
          params: {
            pagenum: this.currentPage,//当前页的参数
            pagesize: this.pagesize,//页容量的分页
            query: this.search
          }
        })
        .then(res => {
          let { meta, data } = res.data;
          if (meta.status === 200) {
              this.total = data.total;
            this.ProductTableData = data.goods;
          }else{
              this.$message.error(meta.msg)
          }

        });
    },
    // 搜索按钮
    SelectSearch() {
        this.getAllProduct()
    },
    // 分页的每页条数(5.10.15) 每页条数更改时触发
    handleSizeChange(val){
        this.pagesize = val
        this.getAllProduct()
    },
    // 当前页数改变时触发 
    // val是自带参数 值是当前点击的1.2.3.4页
    handleCurrentChange(val){
        // console.log('页数'+val)
        this.currentPage = val
        this.getAllProduct()
    },
    // 商品列表的编辑
    ProductEdit() {},
    // 编辑框的提交
    EidtAdd() {},
    // 商品列表的删除
    ProductrDelet() {},
    // 添加用户弹窗
    showGoodsAdd() {
        // this.addDialog = true
       this.$router.push('/goods/add')
    },
    // 新增对话框中的提交
    postAdd() {}
  },
  mounted() {
    this.getAllProduct();
  },
  components: {
    BreadNav
  }
};