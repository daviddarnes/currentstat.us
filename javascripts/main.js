(function() {

  Vue.config.delimiters = ['[[', ']]'];

  new Vue({
    el: '#app',
    data: {
      statuses: []
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
