"use strict";

// Extension namespace
var sn = sn || {};

sn.getFirstElementByXpath = function(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};

////////////////////////////////////////////////////////////
// sn.Bar class definition

sn.Bar = function() {
  this.boundHandleRequest_ = this.handleRequest_.bind(this);

  this.inDOM_ = false;

  this.barFrame_ = document.createElement('iframe');
  this.barFrame_.src = chrome.runtime.getURL('panel.html');
  this.barFrame_.id = 'sn-bar';
  // Init to hidden so first showBar_() triggers fade-in.
  this.barFrame_.classList.add('hidden');

  chrome.runtime.onMessage.addListener(this.boundHandleRequest_);
};

sn.Bar.prototype.hidden_ = function() {
  return this.barFrame_.classList.contains('hidden');
};

sn.Bar.prototype.showBar_ = function() {
  var that = this;
  function impl() {
    that.barFrame_.classList.remove('hidden');
  }
  if (!this.inDOM_) {
    this.inDOM_ = true;
    document.body.appendChild(this.barFrame_);
  }
  window.setTimeout(impl, 0);
};

sn.Bar.prototype.hideBar_ = function() {
  var that = this;
  function impl() {
    that.barFrame_.classList.add('hidden');
  }
  window.setTimeout(impl, 0);
};

sn.Bar.prototype.toggleBar_ = function() {
  if (this.hidden_()) {
    this.showBar_();
  } else {
    this.hideBar_();
  }
};

sn.Bar.prototype.handleRequest_ = function(request, sender, cb) {
  if (request.type === 'evaluate') {
    this.query_ = request.query;
    var element = sn.getFirstElementByXpath(this.query_);
    chrome.runtime.sendMessage({
      type: 'evaluated',
      result: Boolean(element) ? Snapshooter(element) : null
    });
  } else if (request.type === 'moveBar') {
    // Move iframe to a different part of the screen.
    this.barFrame_.classList.toggle('bottom');
  } else if (request.type === 'hideBar') {
    this.hideBar_();
    window.focus();
  } else if (request.type === 'toggleBar') {
    this.toggleBar_();
  }
};

////////////////////////////////////////////////////////////
// Initialization code

window.snBarInstance = new sn.Bar();
