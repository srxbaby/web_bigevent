$(function(){
    const q={
        pagenum:1, //页码值
        pagesize:2, //每页显示的条数
        cate_id:'', //查询分类文章的id
        state:'', //查询文章的状态
    }
    const initTable=()=>{
        $.ajax({
            type:'GET',
            url:'/my/article/list',
            data:q,
            success:res=>{
                if(res.status!==0)return layer.msg('获取列表失败')
                const htmlStr=template('tpl-table',res)
                $('tbody').html(htmlStr)
                  // 调用渲染分页的方法
            renderPage(res.total)
            }
        })
    }
    initTable()
    const form = layui.form;
    // 初始化文章分类的方法
    const initCate = () => {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败！");
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            },
        });
    };
    
    initCate();
  //筛选数据
    $('#form-search').submit((e)=>{
        e.preventDefault()
        q.cate_id=$('[name=cate_id]').val()
        q.state=$('[name=state]').val()
        initTable()
    })
    // 定义美化时间的过滤器
template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}

// 定义补零的函数
function padZero(n) {
    return n > 9 ? n : '0' + n
}
const laypage=layui.laypage
// 定义渲染分页方法
function renderPage(total) {
      // 调用 laypage.render() 方法来渲染分页的结构
      laypage.render({
        elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum, // 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        jump: function(obj, first) {
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            console.log(first)
            console.log(obj.curr)
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            q.pagenum = obj.curr
            q.pagesize=obj.limit
            // 根据最新的 q 获取对应的数据列表，并渲染表格
            // initTable()
            if (!first) {
                initTable()
            }
        }
    })
  }
//删除功能
 $('tbody').on('click','.btn-delete',function(){
     const len=$('.btn-delete').length
     const id=$(this).attr('data-id')
     layer.confirm('确认删除？',{icon:3,title:'提示'},function(index){
         $.ajax({
             type:'GET',
             url:'/my/article/delete/'+id,
             success:res=>{
                 if(res.status!==0)return layer.msg('删除文章失败')
                 layer.msg('删除文章成功')
                 if(len===1){
                     q.pagenum=q.pagenum===1?1:q.pagenum -1
                 }
                 initTable()
                 layer.close(index)
             }
         })
     })
 })
})
