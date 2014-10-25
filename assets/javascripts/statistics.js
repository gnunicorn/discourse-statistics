(function () {
    var StatisticsView = Ember.View.extend({
        templateName: "statistics",
        tagName: "span",
        noteDraft: "",
        classNames: ['statistics-ui'],
        statistics: function(){
            return Discourse.Site.currentProp("statistics") || {};
        }.property()
    });
    // DEFUNC
    // Discourse.HeaderView.reopen({

    //     renderStatisticsView: function () {
    //         if (this.get('statisticsView')) return;
    //         var view = this.createChildView(StatisticsView);

    //         this.set('statisticsView', view);
    //     }.on('didInsertElement'),

    //     clearStatisticsView: function() {
    //         if (this.get('statisticsView')) {
    //             this.get('statisticsView').destroy();
    //         }
    //     }.on('willDestroyElement')
    // });
})();
