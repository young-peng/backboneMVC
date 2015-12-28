define(["text!../template/orderLinkCountView.html","../model/orderModel","text!../template/orderLinkCountBody.html"],function (text,model,body) {
    var OrderListView = Backbone.View.extend({
        el : "#container",
        initialize: function () {

        },
        events : {
            "click .query"      : "query"
        },
        model : new model(),
        render: function () {
            var template = _.template(text);
            this.$el.html(template());
            var date = new Date();
        },
        query : function (e) {
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
            $.when(this.model.orderLinkCount(params)).done(function (data) {
                if (data.code === 0) {
                    var template = _.template(body);
                    var total = 0;
                    _.each(data.data,function (i) {
                        total += parseInt(i.order_count);
                    });
                    $(".tbody").html(template({data:data.data,total:total}));
                }
            }).fail(function (e) {
                alert("失败");
            });
        }
    });
    return OrderListView;
});