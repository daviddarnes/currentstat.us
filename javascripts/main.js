(function() {

  Vue.config.delimiters = ['[[', ']]'];

  var status_box = {
    template: '#status-box',
    props: ['status']
  };

  new Vue({
    el: '#app',
    data: {
      statuses: []
    },
    components: {
      'status-box': status_box
    },
    ready: function() {
      this.$http.get('statuses.json', function(data) {
        this.statuses = data;
      }).error(function(data, status, request) {
        console.log(data, status, request);
      });
    }
  });

})();
