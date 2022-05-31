$(function(){
    const form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        samePwd:(val)=>{
            if(val===$('[name=oldPwd]').val()) return '新旧密码不能相同'
        },
        rePwd:val=>{
            if(val!==$('[name=newPwd').val()) return '两次密码输入不一致'
        }
    })

    //更新密码
    $('.layui-form').submit((e)=>{
        e.preventDefault()
        $.ajax({
            type:'POST',
            url:"/my/updatepwd",
            data:$('.layui-form').serialize(),
            success:res=>{
                if(res.status!==0) return layer.msg('修改密码失败')
                localStorage.removeItem('token') //修改完密码之后清空token
                window.parent.location.href='/login.html' //让页面跳转到login登录界面
            }
        })
    })
})