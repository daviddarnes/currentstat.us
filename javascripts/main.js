(function() {

  Vue.config.delimiters = ['[[', ']]'];

  var status_box = {
    template: '#status-box',
    props: ['status']
  };

  Vue.filter('empty?', function (value) {
    return !value.length;
  });

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
