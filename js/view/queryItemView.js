define(["text!../template/queryItem.html","../model/orderModel","text!../template/itemquerybody.html"],function (text,model,body) {
    var OrderListView = Backbone.View.extend({
        el : "#container",
        initialize: function () {

        },
        events : {
            "click .query"      : "query",
            "click .uppage"     : "uppage",
            "click .nextpage"   : "nextpage"
        },
        pageSize : 10,
        pageNo : 1,
        model : new model(),
        render: function (sn) {
            var template = _.template(text)
            this.$el.html(template());
            var date = new Date();
            if (sn) {
                $("#item").val(sn);
                this.query();
            }
        },
        query : function (e) {
            if (e)  this.pageNo = 1;
            var val = $("#item").val();
            var self = this;
            var startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            var end = new Date(endDate);
            var start = new Date(startDate);
            if (end.getTime()<start.getTime()) {
                alert("开始日期大于结束日期");
                return;
            }
            var params = {};
            params.startDate = startDate;
            params.endDate = endDate;
            params.pageSize = this.pageSize;
            params.pageNo = this.pageNo;
            params.sn = val;
            $("#loading").showMask();
            $.when(this.model.queryItem(params)).done(function (data) {
                var html = _.template(body);
                if (data.total) {
                    var totalPage = 0;
                    if(data.total%self.pageSize === 0) {
                        totalPage = parseInt(data.total/self.pageSize);
                    } else {
                        totalPage = parseInt(data.total/self.pageSize)+1;
                    }
                    $(".tbody").empty().html(html({data:data.data,totalPage : totalPage,pageNo : data.page_no}));
                } else {
                    $(".tbody").empty().html(html({data:data.data,totalPage : totalPage,pageNo : data.page_no}));
                }

                $("#loading").hideMask();
            }).fail(function (e) {
                alert("失败");
                $("#loading").hideMask();
            });
        },
        nextpage : function () {
            this.pageNo++;
            this.query();
        },
        uppage : function () {
            this.pageNo--;
            this.query();
        }
    });
    return OrderListView;
});