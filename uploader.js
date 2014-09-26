/*@include ../adobe-flash/flash.js */
/*@include ../m1ke-utils/serialize.js */
/*@include ../m1ke-utils-jq/jq-serialize.js */
/*@include ../uploadify/uploadify-3.1.js */

var fileUploader={
	formData:function($form){
		var formData=$form.is('form') ? $form.serializeObject() : $form.data();
		formData.ajax=1;
		formData.uploadKey=0;
		return formData;
	}
	,handle:false
};

$.fn.fileUploader=function(fileUploaderHandle){
	return this.each(function(){
		if (detectFlashVer(8,0,0)){
			var key=$('.uploadify').length;
			$(this)
			.find('[type="submit"]').hide().end()
			.find('.queue').attr('id','upload-queue-'+key).end()
			.find('input[name="image"]').attr('id','upload-'+key).uploadify({
				auto:true
				,buttonText:'Select '+$(this).children('fieldset').data('files')
				,cancelImg:app.url+'themes/images/cancel.png'
				,fileObjName:'image'
				,formData:fileUploader.formData($(this))
				,onUploadStart:function(file){
					var $form=$(this.wrapper).closest('.uploader')
						,data=$form.is('form') ? $form.serializeObject() : $form.data();
					data.uploadKey=$form.data('uploadKey');
					this.wrapper.uploadify('settings','formData',$.extend(this.wrapper.uploadify('settings','formData'),data));
				}
				,multi:true
				,onUploadSuccess:function(file,response,success){
					if (fileUploader.handle){
						fileUploader.handle(file,response,success);
					}
				}
				,queueID:'upload-queue-'+key
				,swf:app.url+'js/assets/uploadify-3.1.swf'
				,uploader:$(this).is('form') ? $(this).attr('action') : $(this).data('url')
			});
			console.log($(this).is('form') ? $(this).attr('action') : $(this).data('url'));
			do {
				$(this).data('uploadKey',key);
			}
			while ($(this).data('uploadKey')!=key)
		}
		else {
			$(this).find('.noflash').show();
		}
	});
};