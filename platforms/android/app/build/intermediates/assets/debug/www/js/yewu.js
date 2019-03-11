/**
 * Created by Bowa on 2014/8/28.
 */
var shoplist = [];
var goodlist = [];
var focusobj = null;
var focushop = null;
var focuspost = null;
var gouwuche = "gouwuche";
var postslist = [];
var focuslist = [];

$(function(){
//设置类别列表
    var p = {};
    p.tpl = '<li><a onclick="toShop(%s)" href="#">'+
                //'<img src="'+fileurl+'%s" style="height: 80px;">'+
                '<h2>%s</h2>'+
                //'<p>电话:%s</p>'+
                '<p>%s</p>'+
            '</a></li>';
    p.colums = ["id","sname","note"];
    $("#shops").data("property",JSON.stringify(p));

    var p2 = {};
    p2.tpl = '<li onclick="toGood(%s);">'+
        '<img src="'+fileurl+'%s" class="myliimg">'+
        '<h2>%s</h2>'+
        '<p>%s</p>'+
        '</li>';
    p2.colums = ["id","img","gname","note"];
    $("#goods").data("property",JSON.stringify(p2));

    var p3 = {};
    p3.tpl = '<li><a>'+
        '<img src="'+fileurl+'%s" class="ui-li-thumb">'+
        '<h2>%s</h2>'+
        '</a><a onclick="removeCar()"></a></li>';
    p3.colums = ["img","gname","id"];
    $("#cars").data("property",JSON.stringify(p3));

    var p4 = {};
    p4.tpl = '<li><a href="#" onclick="billDetail(%s);">'+
        '<h2>%s</h2>'+
        '<p>%s</p>'+
        '<p>电话:%s</p>'+

        '</a></li>';
    p4.colums = ["id","ndate","gnames","tel"];
    $("#bills").data("property",JSON.stringify(p4));

    var p5 = {};
    p5.tpl = '<li><a href="#" onclick="postDetail(%s);">'+
    '<h2>%s</h2>'+
    '<p>%s</p>'+
    '</a></li>';
    p5.colums = ["id","title","ndate"];
    $("#posts").data("property",JSON.stringify(p5));

    var p6 = {};
    p6.tpl = '<li><a href="#" onclick="">'+
    '<h2>%s</h2>'+
    '<p>%s</p>'+
    '<p>%s</p>'+
    '</a></li>';
    p6.colums = ["ndate","note","username"];
    $("#replays").data("property",JSON.stringify(p6));

    var p66 = {};
    p66.tpl = '<li><a href="#" onclick="">'+
        '<h2>%s</h2>'+
        '<p>%s</p>'+
        '<p>%s</p>'+
        '</a></li>';
    p66.colums = ["ndate","note","username"];
    $("#replays2").data("property",JSON.stringify(p66));









    var p666 = {};
    p666.tpl = '<li onclick="noticeDetail(%s)">'+
        '<h2>%s</h2>'+
        '<p>%s</p>'+
        '</li>';
    p666.colums = ["id","title","note"];
    $("#noticelist").data("property",JSON.stringify(p666));

});

function toMain(){
    /*changePage("mainpage");
    listShop();*/
    toGoods();
}

function toMore(){
    changePage('morepage');
}

function listShop(){
    ajaxCallback("listShop",{},function(data){
        shoplist = data;
        $("#shops").refreshShowListView(data);
    });
}

function toShop(id){
    changePage('mainpage');
    listShop();
}

function toGoods(id){
    var sid = id || "";
    changePage("goodspage");
    listType();
    listGood(sid);
}

function refreshGood(title,type){
    var stype = title || $("#type").val() || "";
    ajaxCallback("listGood",{stitle:title,stype:stype},function(data){
        $("#goods").refreshShowListView(data);
    });
}

function listGood(sid){
    ajaxCallback("listGood",{sid:sid},function(data){
        goodlist = data;
        $("#goods").refreshShowListView(data);
    });
}

function listType(){
    ajaxCallback("listType",{},function(data){
        $("#type").empty();
        var html = "<option value=''>请选择</option>";
        $("#type").append(html);
        for(var i=0;i<data.length;i++){
            var obj = data[i];
            var html = "<option value='"+obj.id+"'>"+obj.title+"</option>";
            $("#type").append(html);
        }
    });
}

function toGood(id){
    var obj = getGoodById(id);
    focusobj = obj;
    changePage("goodpage");
    $("#gname2").text("活动名:"+obj.gname);
    $("#gimg2").attr("src",fileurl+obj.img);
    $("#gnote2").text("简介:"+obj.note);
    //$("#gprice2").text("价格:"+obj.price);
    $("#lxdh").text("联系电话:"+obj.tel);
    listReplay2();
}

function getGoodById(id){
    for(var i=0;i<goodlist.length;i++){
        var good = goodlist[i];
        if(good.id == id){
            return good;
        }
    }
    return null;
}

function tijiaouser(){
    var note = $("#infobeizhu2").val();
    var bill = {};
    bill.uid = userinfo.id;
    bill.user = userinfo.username;
    //bill.shop = focushop.sname;
    //bill.sid = focushop.id;
    bill.gids = focusobj.id;
    bill.gnames = focusobj.gname;
    bill.total = focusobj.price;
    bill.tel = userinfo.tel;
    bill.address = userinfo.address;
    bill.note = note;
    ajaxCallback("saveBill",bill,function(){
        showLoader("参与提交成功!",true);
        showTipTimer("参与提交成功!",function(){
            toMyBill();
        });

    });
}

function tijiao(){
    if(userinfo){
        changePage("infopage2");
        $("#iscar2").val("1");
    }else{
        changePage("infopage");
        $("#iscar").val("1");
    }
}

function tijiaoyouke(){
    var tel = $("#infotel").val();
    var address = $("#infoaddress").val();
    var note = $("#infobeizhu").val();
    if($.trim(tel)=="" || $.trim(address)==""){
        showLoader("请填写电话和地址信息!",true);
        return;
    }
    if(tel.length<11){
        showLoader("请填写正确的电话号码!",true);
        return;
    }
    var bill = {};
    bill.shop = focushop.sname;
    bill.sid = focushop.id;
    bill.gids = focusobj.id;
    bill.gnames = focusobj.gname;
    bill.total = focusobj.price;
    bill.tel = tel;
    bill.address = address;
    bill.note = note;
    ajaxCallback("saveBill",bill,function(){
        showLoader("参与提交成功!",true);
        showTipTimer("参与提交成功!",function(){
            toMyBill();
        });

    });
}

function youketijiao(){
    var type = $("#iscar").val();
    if(type == 1){
        tijiaoyouke();
    }else{
        tijiaocaryouke();
    }
}

function usertijiao(){
    var type = $("#iscar2").val();
    if(type == 1){
        tijiaouser()
    }else{
        tijiaocaruser();
    }
}

function addToCar(){
    var str = localStorage[gouwuche];
    var list = [];
    if(str){
        list = JSON.parse(str);
    }
    list.push(focusobj);
    localStorage[gouwuche] = JSON.stringify(list);
    showLoader("已经添加到收藏!",true);
}

function showCar(){
    changePage("carspage");
    carlist();
}

function carlist(){
    var str = localStorage[gouwuche];
    var list = [];
    if(str){
        list = JSON.parse(str);
    }
    $("#cars").refreshShowListView(list);
}

function removeCar(id){
    var str = localStorage[gouwuche];
    var list = [];
    var newlist = [];
    if(str){
        list = JSON.parse(str);
        for(var i=0;i<list.length;i++){
            var obj = list[i];
            if(obj.id == id){
                continue;
            }
            newlist.push(obj);
        }
        localStorage[gouwuche] = JSON.stringify(newlist);
        $("#cars").refreshShowListView(newlist);
    }
}

function tijiaocar(){
    if(userinfo){
        changePage("infopage2");
        $("#iscar2").val("2");
    }else{
        changePage("infopage");
        $("#iscar").val("2");
    }
}

function tijiaocaruser(){
    var note = $("#infobeizhu2").val();
    var str = localStorage[gouwuche];
    var sids = [];
    var shopgoods = {};
    var bills = [];
    if(str){
        var list = JSON.parse(str);
        for(var i=0;i<list.length;i++){
            var flag = false;
            var good = list[i];
            for(var n=0;n<sids.length;n++){
                if(sids[n]==good.sid){
                    shopgoods[good.sid].push(good);
                    flag = true;
                    break;
                }
            }
            if(!flag){
                shopgoods[good.sid] = [];
                shopgoods[good.sid].push(good);
                sids.push(good.sid);
            }
        }
    }

    for(var i=0;i<sids.length;i++){
        var goodlist = shopgoods[sids[i]];
        var gids = "";
        var gnames = "";
        var sname = "";
        var total = 0;
        var sid = sids[i];
        var bill = {};
        bill.uid = userinfo.id;
        bill.user = userinfo.username;
        for(var n=0;n<goodlist.length;n++){
            var good = goodlist[n];
            if(n==0){
                sname = good.shop;
                gids+=good.id;
                gnames+=good.gname;
            }else{
                gids+=","+good.id;
                gnames+=","+good.gname;
            }
            total+=parseInt(good.price);
        }
        bill.shop = sname;
        bill.sid = sid;
        bill.gids = gids;
        bill.gnames = gnames;
        bill.total = total;
        bill.tel = userinfo.tel;
        bill.address = userinfo.address;
        bill.note = note;
        bills.push(bill);
    }
    if(bills.length){
        ajaxCallback("saveBills",{bills:JSON.stringify(bills)},function(data){
            localStorage[gouwuche] = "";
            showTipTimer("参与提交成功!",function(){
                toMyBill();
            });
        });
    }

}

function tijiaocaryouke(){
    var tel = $("#infotel").val();
    var address = $("#infoaddress").val();
    var note = $("#infobeizhu").val();
    if($.trim(tel)=="" || $.trim(address)==""){
        showLoader("请填写电话和地址信息!",true);
        return;
    }
    if(tel.length<11){
        showLoader("请填写正确的电话号码!",true);
        return;
    }
    var str = localStorage[gouwuche];
    var sids = [];
    var shopgoods = {};
    var bills = [];
    if(str){
        var list = JSON.parse(str);
        for(var i=0;i<list.length;i++){
            var flag = false;
            var good = list[i];
            for(var n=0;n<sids.length;n++){
                if(sids[n]==good.sid){
                    shopgoods[good.sid].push(good);
                    flag = true;
                    break;
                }
            }
            if(!flag){
                shopgoods[good.sid] = [];
                shopgoods[good.sid].push(good);
                sids.push(good.sid);
            }
        }
    }

    for(var i=0;i<sids.length;i++){
        var goodlist = shopgoods[sids[i]];
        var gids = "";
        var gnames = "";
        var sname = "";
        var total = 0;
        var sid = sids[i];
        var bill = {};
        bill.uid = "";
        bill.user = "";
        for(var n=0;n<goodlist.length;n++){
            var good = goodlist[n];
            if(n==0){
                sname = good.shop;
                gids+=good.id;
                gnames+=good.gname;
            }else{
                gids+=","+good.id;
                gnames+=","+good.gname;
            }
            total+=parseInt(good.price);
        }
        bill.shop = sname;
        bill.sid = sid;
        bill.gids = gids;
        bill.gnames = gnames;
        bill.total = total;
        bill.tel = tel;
        bill.address = address;
        bill.note = note;
        bills.push(bill);
    }
    if(bills.length){
        ajaxCallback("saveBills",{bills:JSON.stringify(bills)},function(data){
            localStorage[gouwuche] = "";
            showTipTimer("参与提交成功!",function(){
                toMyBill();
            });
        });
    }

}



function toMyBill(){
    if(userinfo){
        changePage("mybillpage");
        mybillslist();
    }else{
        changePage("loginpage");
    }

}

function mybillslist(){
    ajaxCallback("mybills",{uid:userinfo.id},function(data){
        $("#bills").refreshShowListView(data);
    });
}

function billDetail(id){

}

function toLuntan(uid){
    changePage("luntanpage");
    listPosts(uid);
}
function listPosts(uid){
    uid = uid || "";
    ajaxCallback("listPosts",{uid:uid},function(data){
        postslist = data;
        $("#posts").refreshShowListView(data);
    });
}
function toAddForm(){
    changePage("addformpage");
}
function addForm(){
    var note = $("#fnote").val();
    var title = $("#ftitle").val();
    ajaxFormUploadFile(function (r){
        ajaxCallback("addPosts",{uid:userinfo.id,title:title,note:note,username:userinfo.username,img:r},function(){
            toLuntan();
        });
    })

}

function delPosts(){
    ajaxCallback("delPosts",{id:focuspost.id},function(data){
        toLuntan();
    });
}
function postDetail(id){
    var obj = getPostsById(id);
    focuspost = obj;
    changePage("postdetail");
    $("#vptitle").text("标题:"+obj.title);
    $("#vpnote").text("内容:"+obj.note);
    $("#vpusername").text("发布者:"+obj.username);
    $("#vpdate").text("时间:"+obj.ndate);
    if(obj.img){
        $("#pimg").attr("src",fileurl+obj.img).show();
    }else{
        $("#pimg").hide();
    }
    if(obj.uid == userinfo.id){
        $("#mypost").show();
    }else{
        $("#mypost").hide();
    }
    listReplay();
}
function listReplay(){
    ajaxCallback("listReplay",{pid:focuspost.id},function(data){
        $("#replays").refreshShowListView(data);
    });
}
function listReplay2(){
    ajaxCallback("listReplay",{pid:focusobj.id},function(data){
        $("#replays2").refreshShowListView(data);
    });
}
function addReplay(){
    var note = $("#rnote").val();
    ajaxCallback("addReplay",{pid:focuspost.id,uid:userinfo.id,username:userinfo.username,note:note},function(data){
        listReplay();
    });
}
function addReplay2(){
    var note = $("#rnote2").val();
    ajaxCallback("addReplay",{pid:focusobj.id,uid:userinfo.id,username:userinfo.username,note:note},function(data){
        listReplay2();
        nativeNotice("收到新的留言",note);
    });
}
function getPostsById(id){
    for(var i=0;i<postslist.length;i++){
        if(postslist[i].id == id){
            return postslist[i];
        }
    }
}

function toFabu(){
    changePage("fabupage");
    ajaxCallback("listType",{},function(data){
        shoplist = data;
        $("#fcity").refreshShowSelectMenu(data,"选择分类","id","title");
    });
}

function mypost(){
    toLuntan(userinfo.id);
}

function saveGood(){
    var fdata = serializeObject($("#goodform"));
    fdata.sid = userinfo.id;
    fdata.shop = userinfo.username;

    ajaxFormUploadFile(function(img){
        fdata.img = img;
        ajaxCallback("saveGood",fdata,function(){
            showLoader("发布成功!",true);
            toGoods();
        });
    });
}

function mygood(){
    toGoods(userinfo.id);
}

function toNotice(type){

    changePage('noticepage');
    listNotice();
}

function listNotice(type){
    ajaxCallback("listNotice",{type:type},function(data){
        focuslist = data;
        $("#noticelist").refreshShowListView(data);
    });
}

function noticeDetail(id){
    var obj = getObjectById(id,focuslist);
    changePage('noticedetailpage');

    $("#vtitle").text(obj.title);
    $("#vnote").text(obj.note);

    $("#vndate").text("时间:"+obj.ndate);

    $("#dimg").attr("src",fileurl+obj.img);

}