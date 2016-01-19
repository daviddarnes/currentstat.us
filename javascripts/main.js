(function() {

  Vue.config.delimiters = ['[[', ']]'];

  var status_box = {
    template: '#status-box',
    data: function() {
      return {
        loading: true
      }
    },
    props: ['status'],
    ready: function() {
      var self = this;
      var image = new Image();
      image.onload = function() {
        self.$el.style.backgroundImage = 'url('+ self.status.image +')';
        self.loading = false;
      };
      image.src = this.status.image;
    }
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
