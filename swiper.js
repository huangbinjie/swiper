/*
	updown--正常滑动缩小
	updownPage--正常按页翻动无特效
*/

var Swiper = function (container, options) {
	var _this = this;
	var type = options.slideDirection || "updown";
	_this.containerHeight = container.height();
	_this.containerWidth = container.width();
	_this.y = _this.containerHeight;
	_this.x = _this.containerWidth;
	_this.scale = 1;
	_this.angle = 0;
	var isScrolling = false;
	var pointer = {},
		active;
	_this.slider = container.find(".swiper-slide"); //所有焦点图
	_this.active = container.find(".active");
	var temp; //上下页切换中间变量
	this.direction; //滑动时方向

	this.index = 0;
	this.isLoop = options.isLoop || false;
	var rate = 0.0005;
	//		this.maxScale = this.scale - _this.containerHeight * this.rate;
	var current; //当前焦点图
	this.pagelength = options.pagelength || 0;
	this.filter = options.filter || null; //过滤元素
	var transitionTime = ".25s";
	this.dataComplete = options.dataComplete || false;
	this.transitionFuction = options.transitionFuction || "linear";
	this.isMouseEventAvailable = options.isMouseEventAvailable || false;


	//触摸事件
	container.on("touchstart", function (e) {
		var touch = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0];
		pointer.x = touch.clientX, pointer.y = touch.clientY;
		if (options.touchStart) options.touchStart();
	});

	container.on("touchmove", function (e) {
		if (isScrolling || _this.pagelength === 1) { //防止滑动中还能触发touchmove,一张图片不让滑动
			return;
		}
		//过滤
		if ($(e.target).parents(_this.filter).length == 1) return;
		var touch = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0];
		if (type === "updown") {
			var distance = touch.clientY - pointer.y;
			if (distance < 0) { //向上滑
				if (typeof (_this.direction) === "undefined" || _this.direction === "up") {
					if (!_this.isLoop && _this.index === _this.pagelength - 1) {
						return;
					}
					_this.prev = _this.active.next();
					_this.y += distance;
					_this.scale += distance * rate;
					_this.whiteSpace = (_this.containerHeight - _this.containerHeight * _this.scale) * -1;
					_this.direction = "up";
					if (options.swipeUp) options.swipeUp.apply(_this);
					//显示下一张
					if (_this.prev.length > 0) {
						_this.prev.css("-webkit-transform", "translate3d(0," + _this.y + "px,0)").removeClass("hide").addClass("show");
					} else {
						_this.prev = _this.slider.first();
						_this.prev.css("-webkit-transform", "translate3d(0," + _this.y + "px,0)").removeClass("hide").addClass("show");
					}
				} else {
					_this.prev = _this.active.prev();
					_this.y -= distance;
					_this.scale -= distance * 0.0005;
					if (_this.scale >= 1) {
						_this.scale = 1;
						_this.y = _this.containerHeight;
					}
					_this.whiteSpace = _this.containerHeight - _this.containerHeight * _this.scale;
					if (options.swipeDown) options.swipeDown.apply(_this);
					_this.prev.css("-webkit-transform", "translate3d(0,-" + _this.y + "px,0)").removeClass("hide").addClass("show");
				}
			} else if (distance > 0) { //向下滑
				if (typeof (_this.direction) === "undefined" || _this.direction === "down") {
					if (!_this.isLoop && _this.index === 0) {
						return;
					}
					_this.prev = _this.active.prev();
					_this.y -= distance;
					_this.scale -= distance * rate;
					_this.whiteSpace = _this.containerHeight - _this.containerHeight * _this.scale;
					_this.direction = "down";
					//显示上一张
					if (options.swipeDown) options.swipeDown.apply(_this);
					_this.prev.css("-webkit-transform", "translate3d(0,-" + _this.y + "px,0)").removeClass("hide").addClass("show");
				} else {
					_this.prev = _this.active.next();
					_this.y += distance;
					_this.scale += distance * rate;
					if (_this.scale >= 1) {
						_this.scale = 1;
						_this.y = _this.containerHeight;
					}
					_this.whiteSpace = (_this.containerHeight - _this.containerHeight * _this.scale) * -1;
					if (options.swipeUp) options.swipeUp.apply(_this);
					//显示上一张
					if (_this.prev.length > 0) {
						_this.prev.css("-webkit-transform", "translate3d(0," + _this.y + "px,0)").removeClass("hide").addClass("show");
					} else {
						_this.prev = _this.slider.first();
						_this.prev.css("-webkit-transform", "translate3d(0," + _this.y + "px,0)").removeClass("hide").addClass("show");
					}
				}
			}
			//缩放
			_this.active.css({
				"-webkit-transform": "scale(" + _this.scale + ") translate3d(0," + _this.whiteSpace + "px,0)"
			});
		} else if (type == "updownPage") {
			var distance = touch.clientY - pointer.y;
			if (distance < 0) { //向上滑
				if (typeof (_this.direction) === "undefined" || _this.direction === "up") {
					if (!_this.isLoop && _this.index === _this.pagelength - 1) {
						return;
					}
					_this.prev = _this.active.next();
					_this.y += distance;
					_this.direction = "up";
					if (options.swipeUp) options.swipeUp.apply(_this);
					//显示下一张
					if (_this.prev.length > 0) {
						_this.prev.css("-webkit-transform", "translate3d(0," + _this.y + "px,0)").removeClass("hide").addClass("show");
					} else {
						_this.prev = _this.slider.first();
						_this.prev.css("-webkit-transform", "translate3d(0," + _this.y + "px,0)").removeClass("hide").addClass("show");
					}
				} else {
					_this.prev = _this.active.prev();
					_this.y -= distance;
					if (options.swipeDown) options.swipeDown.apply(_this);
					_this.prev.css("-webkit-transform", "translate3d(0,-" + _this.y + "px,0)").removeClass("hide").addClass("show");
				}
			} else if (distance > 0) { //向下滑
				if (typeof (_this.direction) === "undefined" || _this.direction === "down") {
					if (!_this.isLoop && _this.index === 0) {
						return;
					}
					_this.prev = _this.active.prev();
					_this.y -= distance;
					_this.direction = "down";
					//显示上一张
					if (options.swipeDown) options.swipeDown.apply(_this);
					_this.prev.css("-webkit-transform", "translate3d(0,-" + _this.y + "px,0)").removeClass("hide").addClass("show");
				} else {
					_this.prev = _this.active.next();
					_this.y += distance;
					if (options.swipeUp) options.swipeUp.apply(_this);
					//显示上一张
					if (_this.prev.length > 0) {
						_this.prev.css("-webkit-transform", "translate3d(0," + _this.y + "px,0)").removeClass("hide").addClass("show");
					} else {
						_this.prev = _this.slider.first();
						_this.prev.css("-webkit-transform", "translate3d(0," + _this.y + "px,0)").removeClass("hide").addClass("show");
					}
				}
			}
		} else if (type == "leftright") {
			var distance = touch.clientX - pointer.x;
			if (distance < 0) { //向左滑
				if (typeof (_this.direction) === "undefined" || _this.direction === "left") {
					if (!_this.isLoop && _this.index === _this.pagelength - 1) {
						return;
					}
					_this.prev = _this.active.next();
					_this.x += distance;
					_this.scale += distance * rate;
					_this.whiteSpace = (_this.containerHeight - _this.containerHeight * _this.scale) * -1;
					_this.direction = "left";
					if (options.swipeLeft) options.swipeLeft.apply(_this);
					//显示下一张
					if (_this.prev.length > 0) {
						_this.prev.css("-webkit-transform", "translate3d(" + _this.x + "px,0,0)").removeClass("hide").addClass("show");
					} else {
						_this.prev = _this.slider.first();
						_this.prev.css("-webkit-transform", "translate3d(" + _this.x + "px,0,0)").removeClass("hide").addClass("show");
					}
				} else {
					_this.prev = _this.active.prev();
					_this.x -= distance;
					_this.scale -= distance * 0.0005;
					if (_this.scale >= 1) {
						_this.scale = 1;
						_this.x = _this.containerWidth;
					}
					_this.whiteSpace = _this.containerWidth - _this.containerWidth * _this.scale;
					if (options.swipeRight) options.swipeRight.apply(_this);
					_this.prev.css("-webkit-transform", "translate3d(" + _this.x + "px,0,0)").removeClass("hide").addClass("show");
				}
			} else if (distance > 0) { //向右滑
				if (typeof _this.direction == "undefined" || _this.direction == "right") {
					if (!_this.isLoop && _this.index === 0) {
						return;
					}
					_this.prev = _this.active.prev();
					_this.x -= distance;
					_this.scale -= distance * rate;
					_this.whiteSpace = _this.containerWidth - _this.containerWidth * _this.scale;
					_this.direction = "right";
					//显示上一张
					if (options.swipeRight) options.swipeRight.apply(_this);
					_this.prev.css("-webkit-transform", "translate3d(-" + _this.x + "px,0,0)").removeClass("hide").addClass("show");
				} else {
					_this.prev = _this.active.next();
					_this.x += distance;
					_this.scale += distance * rate;
					if (_this.scale >= 1) {
						_this.scale = 1;
						_this.x = _this.containerWidth;
					}
					_this.whiteSpace = (_this.containerWidth - _this.containerWidth * _this.scale) * -1;
					if (options.swipeLeft) options.swipeLeft.apply(_this);
					//显示上一张
					if (_this.prev.length > 0) {
						_this.prev.css("-webkit-transform", "translate3d(" + _this.x + "px,0,0)").removeClass("hide").addClass("show");
					} else {
						_this.prev = _this.slider.first();
						_this.prev.css("-webkit-transform", "translate3d(" + _this.x + "px,0,0)").removeClass("hide").addClass("show");
					}
				}
			}
			//缩放
			_this.active.css({
				"-webkit-transform": "scale(" + _this.scale + ") translate3d(" + _this.whiteSpace + "px,0,0)"
			});
		} else if (type == "leftrightRotate") {
			var distance = touch.clientX - pointer.x;
			if (distance < 0) { //向左滑
				if (typeof (_this.direction) === "undefined" || _this.direction === "left") {
					if (!_this.isLoop && _this.index === _this.pagelength - 1) {
						return;
					}
					_this.prev = _this.active.next();
					_this.x += distance;
					_this.scale += distance * 0.001;
					_this.angle += distance * 0.1;
					_this.whiteSpace = (_this.containerWidth - _this.containerWidth * _this.scale) * -1;
					_this.direction = "left";
					if (options.swipeLeft) options.swipeLeft.apply(_this);
					//显示下一张
					if (_this.prev.length > 0) {
						_this.prev.removeClass("hide").addClass("show");
					} else {
						_this.prev = _this.slider.first();
						_this.prev.removeClass("hide").addClass("show");
					}
					_this.active.css({
						"-webkit-transform-origin": "0% 100%",
					});
				} else {
					_this.prev = _this.active.prev();
					_this.x -= distance;
					_this.scale -= distance * 0.001;
					_this.angle += distance * 0.1;
					if (_this.scale >= 1) {
						_this.scale = 1;
						_this.angle = 0;
						_this.x = _this.containerWidth;
					}
					_this.whiteSpace = _this.containerWidth - _this.containerWidth * _this.scale;
					if (options.swipeRight) options.swipeRight.apply(_this);
					_this.prev.removeClass("hide").addClass("show");
					_this.active.css({
						"-webkit-transform-origin": "100% 100%",
					});
				}
			} else if (distance > 0) { //向右滑
				if (typeof _this.direction == "undefined" || _this.direction == "right") {
					if (!_this.isLoop && _this.index === 0) {
						return;
					}
					_this.prev = _this.active.prev();
					_this.x -= distance;
					_this.scale -= distance * 0.001;
					_this.angle += distance * 0.1;
					_this.whiteSpace = _this.containerWidth - _this.containerWidth * _this.scale;
					_this.direction = "right";
					//显示上一张
					if (options.swipeRight) options.swipeRight.apply(_this);
					_this.prev.removeClass("hide").addClass("show");
					_this.active.css({
						"-webkit-transform-origin": "100% 100%",
					});
				} else {
					_this.prev = _this.active.next();
					_this.x += distance;
					_this.scale += distance * 0.001;
					_this.angle += distance * 0.1;
					if (_this.scale >= 1) {
						_this.scale = 1;
						_this.angle = 0;
						_this.x = _this.containerWidth;
					}
					_this.whiteSpace = (_this.containerWidth - _this.containerWidth * _this.scale) * -1;
					if (options.swipeLeft) options.swipeLeft.apply(_this);
					//显示上一张
					if (_this.prev.length > 0) {
						_this.prev.removeClass("hide").addClass("show");
					} else {
						_this.prev = _this.slider.first();
						_this.prev.removeClass("hide").addClass("show");
					}
					_this.active.css({
						"-webkit-transform-origin": "0% 100%",
					});
				}
			}
			//缩放
			_this.active.css({
				"z-index": "1",
				"-webkit-transform": "translate3d(" + _this.whiteSpace+"px,0,0) scale(" + _this.scale + ") rotate(" + _this.angle + "deg)"
			});
		}

		pointer.x = touch.clientX, pointer.y = touch.clientY;
	});

	container.on("touchend", function () {
		if (_this.y === _this.containerHeight && _this.x === _this.containerWidth) {
			_this.direction = undefined;
			return; //防止按着不滑动就松手
		}
		isScrolling = true;
		_this.prev = _this.active;

		if (_this.direction == "up" || _this.direction == "left") {
			if (_this.prev.next().length > 0) {
				_this.active = _this.prev.next();
			} else {
				_this.active = _this.slider.eq(0);
			}
			_this.index === _this.pagelength - 1 ? _this.index = 0 : _this.index++;

			switch (type) {
			case "leftrightRotate":
				_this.prev.css({
					"-webkit-transform": "translate3d(-640px,0,0) rotate(-90deg)",
					"-webkit-transition": transitionTime + " " + _this.transitionFuction
				});
				break;
			}

		} else if (_this.direction == "down" || _this.direction == "right") {
			if (_this.prev.prev().length > 0) {
				_this.active = _this.prev.prev();
			} else {
				_this.active = _this.slider.last();
			}
			_this.index === 0 ? _this.index = _this.pagelength - 1 : _this.index--;

			switch (type) {
			case "leftrightRotate":
				_this.prev.css({
					"-webkit-transform": "translate3d(640px,0,0) rotate(90deg)",
					"-webkit-transition": transitionTime + " " + _this.transitionFuction
				});
				break;
			}
		}
		_this.active.css({
			"-webkit-transform": "translate3d(0,0,0)",
			"-webkit-transition": transitionTime + " " + _this.transitionFuction
		});
		var t = setTimeout(function () {
			_this.prev.css({
				"-webkit-transform": "translate3d(0,0,0)",
				"-webkit-transition": "0s"
			}).addClass("hide").removeClass("show active");
			_this.active.addClass("active").css({
				"-webkit-transform": "translate3d(0,0,0)",
				"-webkit-transition": "0s"
			});
			clearTimeout(t);
			isScrolling = false;
		}, 250)

		if (options.touchend) options.touchend.apply(_this);

		//数据初始化
		_this.y = _this.containerHeight, _this.x = _this.containerWidth, _this.scale = 1, _this.angle = 0, _this.direction = undefined, _this.slider = $(".swiper-slide");

	})

	this.push = function (node) {
		container.append(node);
	}
}

if (typeof define === "function" && define.amd) {
	define(function () {
		return Swiper;
	});
} else if (typeof module != "undefined" && typeof module.exports != "undefined") {
	module.exports = Swiper;
} else {
	window.Swiper = Swiper;
}