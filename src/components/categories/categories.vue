<template>
<!-- <h1>我是商品分类</h1> -->
<el-card>
    <!-- 面包屑 -->
    <BreadNav :navone="'商品管理'" :navtwo="'商品列表'"></BreadNav>
     <!-- 添加按钮 -->
        <el-row class="btnHeight">
            <el-col :span="4">
                <el-button  type="success" plain>添加分类</el-button>
            </el-col>
        </el-row>
        <!--  表格区域 -->
        <el-table :data="pageList" style="width: 100%"  class="btnHeight">
            <!-- treeKey每条数据的唯一标示 -->
            <!-- parentKey父元素的key -->
            <!-- levelKey 当前所属的级别  cat_level中返回的是0-1-2这样的级别-->
            <el-table-tree-column 
            file-icon="icon icon-file" 
            folder-icon="icon icon-folder" 
            prop="cat_name" 
            label="名称" 
            treeKey="cat_id" 
            parentKey="cat_pid" 
            levelKey="cat_level">
            </el-table-tree-column>
            <el-table-column label="级别">
                <template slot-scope="scope">
                    {{ scope.row.cat_level === 0 ? '一级': scope.row.cat_level === 1 ? '二级' : '三级' }}
                </template>
            </el-table-column>
            <el-table-column label="是否有效">
                <template slot-scope="scope">
                    {{ scope.row.cat_deleted ? '无效': '有效'}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template>
                    <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>
          <!-- 分页组件 -->
        <!-- 
            el-pagination：分页组件
                size-change：事件，当页容量发生改变时触发
                current-change：事件，当当前页发生改变时触发
                current-page：属性，当前所在页
                page-sizes：数组，所有可选的页容量
                page-size：当前选中的页容量
                layout：分页组件的布局：
                total：总数据条数
            -->
        <el-pagination 
        :current-page="currentpage" 
        :page-sizes="pagesizes" 
        :page-size="pagesize" 
        layout="total, sizes, prev, pager, next, jumper"
         @current-change="currentChange"
          @size-change="sizeChange" 
          :total="total">
        </el-pagination>
</el-card>
</template>

<script>
import BreadNav from '../breadnav/breadnav.vue'
export default {
    data() {
        return {
            cateList:[],//表格的数据源
            pageList:[],//假分页的数据源
            total:0,
            currentpage:1,
            pagesize:5,//默认页容量
            pagesizes:[5,10,15],
        }
    },
    methods: {
         async getCateList() {
            // 获取所有的分类数据
            // type=3 type可以传1.2.3分别代表一级二级三级 传3就会返回所有的级别
            let res = await this.$http.get('categories?type=3')
            // 解构
            let { meta, data } = res.data
            // 判断
            if (meta.status === 200) {
                this.cateList = data
                // 得到数据的总条数
                this.total = data.length
                // 第一次得到分页数据
                this.getPageList()
            } else {
                this.$message.error(meta.msg)
            }
        },
        currentChange(val){//当前页改变时触发
            this.currentpage = val
            this.getPageList()
        },
        sizeChange(val){//当当前页容量改变时触发
            this.pagesize = val
            this.getPageList()
        },
        getPageList(){//获取分页的数据源
     // 计算开始和结束的数据
            let start = (this.currentpage - 1) * this.pagesize
            let end = this.currentpage * this.pagesize
            // 得到数据源
            this.pageList = this.cateList.slice(start, end)
            // 全部拿到数据后 用slice方法截取0-4条 就拿到了5条数据
            // 把这5条数据存放在pageList中 当做数据源渲染出来
        }
    },
    mounted() {
        this.getCateList()
    },
    components:{
        BreadNav
    }
}
</script>

<style >
    .btnHeight{
      line-height: 0px;
      margin-top: 10px;
    }
</style>
