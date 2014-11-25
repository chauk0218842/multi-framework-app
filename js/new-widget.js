
var newWidgetModal;
var contentContainer;

window.onload = function() {
  newWidgetModal = document.getElementById('new-widget-modal');
  contentContainer = document.getElementById('iframe-container');
};

var toggleModal = function() {
  newWidgetModal.classList.toggle('modal--show');
  newWidgetModal.classList.toggle('modal');
};

var addNewWidget = function() {
  var id = document.getElementById('widget-id').value;
  var src = document.getElementById('widget-source').value;

  var iframe = document.createElement('iframe');
      iframe.setAttribute('id', id);
      iframe.setAttribute('class', 'card-frame');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('src', src + id);

  contentContainer.appendChild(iframe);

  setTimeout(function calcHeight() {
    var h = iframe.contentWindow.document.body.scrollHeight;
    iframe.height = h;
  }, 1000);

  document.getElementById('widget-id').value = '';
  toggleModal();
};