class Tag{
    constructor(obj){
        this.id=document.querySelector(obj.id);
        this.btn=this.id.querySelectorAll("input");
        this.div=this.id.querySelectorAll("div");
        this.colorArr=obj.colorArr;
        this.index=obj.index;//显示元素的下标。
        this.init();
    }
    init(){//初始化
        this.hide();
        this.show();
        var that=this;
        //给按钮增加事件
        for(let i=0;i<this.btn.length;i++){
            this.btn[i].onclick=function(ev){
                this.index=i;
                this.hide();
                this.show();
                ev.cancelBubble=true;
            }.bind(this)
        }
    }
    hide(){//隐藏DIV,去除按钮背景色
        for(var i=0;i<this.btn.length;i++){
            this.btn[i].style.background=null;
            this.div[i].style.display="none";
        }
    }
    show(){//显示指定的DIV,按钮与DIV的背景颜色进行设置
        this.div[this.index].style.display="block";//将DIV进行显示
        //按钮与DIV的背景颜色进行设置
        this.div[this.index].style.background=this.btn[this.index].style.background=this.colorArr[this.index];
    }

}
class autoTag extends Tag{
    constructor(id){
      console.log(id, '这里是对象----》》》')
        super(id);
        this.autoInit();
    }
    autoInit(){
        document.body.onclick=this.change.bind(this);
        setInterval(this.change.bind(this),5000)
    }
    change(){
        this.index+=1;
        if(this.index>=this.btn.length)
            this.index=0;
        this.hide();
        this.show();
    }

}