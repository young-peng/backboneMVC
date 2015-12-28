define(['text!../template/orderLinkTpl.html',"../model/orderModel"], function (tpl,model) {

    var OrderLinkView = Backbone.View.extend({
        el: '#container',
        events : {
        	"click a.add" : "addSN",
        	"click a.del" : "delSN",
            "click a.save": "saveOrder",
            "keydown input[type=text]" : "enterEvent",
            "click .cancelLink" : "cancelLink",
            "click .uppage"     : "uppage",
            "click .nextpage"   : "nextpage"
        },
        initialize: function () {

        },
        model : new model(),
        pageSize : 10,
        currentPage : 1,
        render: function () {
          this.initData()
        },
        initData : function () {
            var self = this;
            $.when(this.model.findLogisticsLogItems(this.currentPage,this.pageSize)).done(function (data) {
                var html = _.template(tpl);
                var totalPage = 0;
                if(data.total%self.pageSize === 0) {
                    totalPage = parseInt(data.total/self.pageSize);
                } else {
                    totalPage = parseInt(data.total/self.pageSize)+1;
                }
                self.$el.html(html({data:data.data,totalPage : totalPage,currentPage : self.currentPage}));
                $("#logisticsNo").focus();
            }).fail(function (e) {
                alert("失败");
            });
        },
        addSN : function (e) {
        	var target = $(e.target);
        	target.parents(".form-group.sn").clone(true).insertAfter(target.parents(".form-group")).find("input").val("");
            if (target.parents(".form-group.sn").find("input").val()) {
                target.parents(".form-group.sn").next().find("input").focus();
            } else {
                target.parents(".form-group.sn").find("input").focus();
            }
        },

        delSN : function (e) {
        	var target = $(e.target);
        	var parents = $(".form-group.sn");
        	if (parents.length>1) 
        		target.parents(".form-group.sn").remove();
            $(".form-group.sn").eq(0).find("input").focus();

        },
        saveOrder : function (e) {
            var self = this;
            var logistics_no = $.trim($("#logisticsNo").val());
            var params = {
                logistics_no   : logistics_no,
                serial_numbers : []
            };
            var str = this.validata(params);
            if (str) {
                alert(str);
                return;
            }
            $.when(this.model.addOrder(params)).done(function (data) {
                if (data.code === 0) {
                    self.render();
                } else {
                    alert(data.msg);
                    self.clearData();
                }
            }).fail(function (e) {
                alert("失败");
            });
        },
        validata : function (params) {
            var str = "";
            $(".serialNumbers").each(function () {
                if (this.value) {
                    var macSplite = this.value.split(":");
                    if (macSplite.length === 1) {
                        if ($.trim(this.value).length>12) {
                            params.serial_numbers.push($.trim(this.value));
                        } else {
                            str = "输入正确的商品SN号";
                            this.value = "";
                        }
                    } else {
                        str = "不能是mac地址";
                        this.value = "";
                    }
                } else {
                    str = "商品sn号不能为空";
                    $(this).focus();
                }
            });
            return str;
        },
        enterEvent : function (e) {
            var target = $(e.target);
            var macSplite = target.val().split(":");
            var self = this;
            if (e.keyCode === 13|| e.keyCode === 108) {
              var input =  target.parents(".form-group").next().find("input");
              if(input.length === 0) {
                      this.querySnformac(macSplite,target,function(){self.saveOrder()});
              } else {
                  if(target.attr("id") === "logisticsNo") {
                      if (target.val()){
                          var index1 = target.val().toUpperCase().indexOf("WE");
                          if(macSplite.length !== 1||index1===0) {
                              alert("快递单号不正确");
                              target.val("");
                              target.focus();
                              return;
                          } else {
                              $.ajax({
                                  url : "/api/v1/order_entries?logisticsNo=" + target.val(),
                                  type : "GET",
                                  contentType : "application/json;charset=UTF-8",
                                  success : function (data) {
                                      var len = 0;
                                      if (data.code === 0) {
                                          _.each(data.data,function (item) {
                                              len += item.quantity
                                          });
                                          var tpl = "";
                                          for(var i = 1;i < len;i++) {
                                              tpl += '<div class="form-group sn adddiv">'+
                                                 '<label  class="col-sm-2 control-label">商品序列号</label>'+
                                                  '<div class="col-sm-8">'+
                                                  '<input type="text" class="form-control serialNumbers" placeholder="商品序列号(请切换英文输入法)"/>'+
                                                  '</div>'+
                                                  '<div class="col-sm-2">'+
                                                  '<a href="javascript:;" class="btn btn-primary add">添加</a>&nbsp;'+
                                                  '<a href="javascript:;" class="btn btn-danger del">删除</a>'+
                                                  '</div>'+
                                                  '</div>';
                                          }
                                          $(".adddiv").remove();
                                          $(".form-group.sn").after(tpl);
                                      }
                                      input.focus();
                                  },
                                  error : function (e) {
                                      alert("失败");
                                  }
                              });
                          }
                      } else {
                          alert("快递单号不能为空");
                          target.focus();
                          return;
                      }
                  } else {
                      this.querySnformac(macSplite,target,function(){input.focus();});
                  }
              }
            }
            e.stopPropagation();
        },
        querySnformac : function (macSplite,target,callback) {
            var self = this;
            if (macSplite.length > 1) {
                $.ajax({
                    url : "api/v1/items/mac/"+target.val(),
                    type : "GET",
                    contentType : "application/json;charset=UTF-8",
                    success : function (data) {
                        if(data.code === 0) {
                            target.val(data.data[0]);
                           callback();
                        } else {
                            alert(data.msg);
                            target.focus();
                            self.clearData();
                        }
                    },
                    error : function (e) {
                        alert("失败");
                    }
                });
            } else {
                callback();
            }
        },
        cancelLink : function (e) {
            var target = $(e.target);
            var self = this;
            var id = target.attr("logisticslogid");
            var vo = JSON.parse(target.attr("vo"));
            vo.status = 0;
            var params = {
                vo : vo,
                id : id
            }
            $.when(this.model.cancelLink(params)).done(function (data) {
                alert(data.msg);
                self.initData();
            }).fail(function (e) {
                alert("失败");
            });
        },
        uppage : function () {
            this.currentPage--;
            this.pager();
        },
        pager : function () {
            var self = this;
            $.when(this.model.findLogisticsLogItems(this.currentPage,this.pageSize)).done(function (data) {
                require(["text!template/logisticslogitemsbody.html"],function (txt) {
                    var html = _.template(txt);
                    var totalPage = 0;
                    if(data.total%self.pageSize === 0) {
                        totalPage = parseInt(data.total/self.pageSize);
                    } else {
                        totalPage = parseInt(data.total/self.pageSize)+1;
                    }
                    $("form").siblings().remove();
                    $("form").after(html({data:data.data,totalPage : totalPage,currentPage : self.currentPage}));
                });
            }).fail(function (e) {
                alert("失败");
            });
        },
        nextpage : function () {
            this.currentPage++;
            this.pager();
        },
        clearData : function () {
            $("input").each(function (i) {
                this.value="";
                $("#logisticsNo").focus();
            });
        }
    });
    return OrderLinkView;
});