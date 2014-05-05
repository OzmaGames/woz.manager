define(['knockout', 'plugins/dialog'], function (ko, dialog) {

   var CheckForm = function (col) {
      var self = this;

      this.col = col;
      this.isCol = col.longName ? true : false;

      this.ok = function () {
         dialog.close(this, self.col);
      }

      this.cancel = function () {
         dialog.close(this);
      }
   }

   CheckForm.show = function (col) {
      return dialog.show(new CheckForm(col));
   }
   return CheckForm;
})