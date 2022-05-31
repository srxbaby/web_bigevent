$(function(){
    const form =layui.form
    form.verify({
        nickname: (val) => {
            if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！";
        },
    });

    const initUser=()=>{
        $.ajax({
            type:'GET',
            url:'/my/userinfo',
            success:res=>{
                if(res.status!==0) return layer.msg('获取用户信息失败！')
                // const {message}=res
                // alert(message)
                form.val("formUserInfo", res.data);
            }
        })
    }

    $('#btnReset').click((e)=>{
        e.preventDefalut()
        initUser()
    })
 //更新用户信息
    $('.layui-form').submit(function(e){ //给表单绑定事件
        e.preventDefault() //阻止表单默认行为
        $.ajax({ 
            type:'POST',  //提交数据
            url:'/my/userinfo',
            data:$(this).serialize(), //提交表单中的数据
            success:res=>{
                if(res.status!==0)return layer.msg('修改信息失败')
                layer.msg('修改信息成功')
                //调用父页面的函数 渲染欢迎界面
                window.parent.getUserInfo()
            }
        })
    })
    initUser()
})

