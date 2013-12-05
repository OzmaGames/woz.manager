define(['knockout', 'plugins/dialog'], function (ko, dialog) {

   var CheckForm = function (word) {
      var self = this;

      this.word = word;

      this.ok = function () {
         dialog.close(this, self.word);
      }

      this.cancel = function () {
         dialog.close(this);
      }
   }

   CheckForm.show = function (word) {
      return dialog.show(new CheckForm(word));
   }
   return CheckForm;
})