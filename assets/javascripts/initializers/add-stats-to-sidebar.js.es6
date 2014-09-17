
export default {
  name: "add-stats-to-sidebar",

  initialize: function() {
    if (!Discourse.SidebarView) return; // this is the sidebar feature

    var StatisticsView = Ember.View.extend({
        templateName: "statistics",
        tagName: "span",
        noteDraft: "",
        classNames: ['statistics-ui'],
        classNameBindings: ["shouldBeHidden:hidden"],

        // only show on list pages
        shouldBeHidden: function(){
            return this.get("currentControllerName") === undefined || this.get("currentControllerName").indexOf("discovery") === -1;
        }.property("currentControllerName"),

        loadStatistics: function() {
            if (this.get("statistics")) return;
            this.set('loading', true);
            Discourse.ajax("/statistics/load", {}).then(function(receivedJSON) {
                    this.set('loading', false);
                    this.set("statistics", receivedJSON.statistics);
                    this.rerender();
            }.bind(this));
        }.on("didInsertElement")
    });

    Discourse.SidebarView.reopen({stats: StatisticsView});

    }
};
