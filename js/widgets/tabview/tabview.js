/**
 * 作者: 郭天琦
 * 创建时间: 2017/06/05
 * 版本: [1.0, 2017/06/05 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: tab切换组件
 */

(function(exports, doc, win) {
    "use strict";

    var defaultSettings = {
        isSwipe: false,
        triggerEvent: 'tap',
        activeCls: '',
        activeIndex: 0
    };

    /**
     * 使用
     * @constructor
     * @param {JSON} options 一些配置
     * container - 容器dom元素 必填
     * triggerEvent - 触发事件 默认tap
     * activeCls - 高亮样式
     * activeIndex - 默认高亮项，默认第一项为0
     * itemClick - 回掉函数，this指向当前点击元素
     * isSwipe - 是否支持滑动 {Boolean} 默认为false
     */
    function TabView(options) {
        var self = this;

        if(!options) {
            throw new Error('请传入配置项');
        }

        var container = options.container;

        if(!(container.nodeType === 1)) {
            container = doc.querySelector(container);
        }

        self.extend(options, defaultSettings);

        self.dom = container;
        self.bodyEle = container.querySelector('[data-role=body]');
        self.headEle = container.querySelector('[data-role=head]');
        self.headChildEle = self.headEle.querySelectorAll('[data-target]');
        self.bodyChildEle = self.bodyEle.querySelectorAll('[data-id]');
        self.pageWidth = win.screen.width;

        // 有样式处理样式
        if(self.activeCls) {
            self.addActive(self.activeCls, self.activeIndex);
        }

        if(self.isSwipe) {
            self.screenMove(options.itemClick);
        }

        self.initListeners(container, self.triggerEvent, options.itemClick);
    }

    /**
     * 处理默认高亮项并且切换位置
     * @param {String} activeCls - 高亮样式
     * @param {Number} activeIndex - 高亮下标
     */
    TabView.prototype.addActive = function(activeCls, activeIndex) {
        var dom = this.dom,
            elHeadEleArray = dom.querySelectorAll('[data-target]');

        this.addClass(elHeadEleArray[activeIndex], activeCls);
        this.transfrom(this.bodyEle, -(activeIndex * this.pageWidth));
    };

    /**
     * 事件监听
     * @param {HTMLElement} dom 元素
     * @param {Event} 事件 默认tap
     */
    TabView.prototype.initListeners = function(dom, target, itemClick) {
        var dom = this.dom,
            that = this,
            elHead = this.headEle,
            elBody = this.bodyEle,
            bodyChildEle = this.bodyChildEle,
            windowWidth = this.pageWidth,
            activeCls = that.activeCls;

        elHead.addEventListener(target, function(e) {
            var elTarget = e.target,
                headId = elTarget.dataset.target;

            var elBodyEle = elBody.querySelector('[data-id="' + headId + '"]'),
                index = that.index(elBodyEle, bodyChildEle);

            if(activeCls) {
                var elTargetEleSilbings = that.siblings(elTarget);

                that.addClass(elTarget, activeCls);
                that.removeClass(elTargetEleSilbings, activeCls);
            }

            that.transfrom(elBody, -(index * windowWidth));

            itemClick.call(e.target, e);
        });
    };

    /**
     * addClass
     * @param {HTMLElement or Array} dom元素
     * @param {String} className
     */
    TabView.prototype.addClass = function(dom, classname) {
        if(Array.isArray(dom)) {
            dom.forEach(function(item) {
                item.classList.add(classname);
            });
        } else {
            dom.classList.add(classname);
        }
    };

    /**
     * removeClass
     * @param {HTMLElement} dom元素
     * @param {String} className
     */
    TabView.prototype.removeClass = function(dom, classname) {
        if(Array.isArray(dom)) {
            dom.forEach(function(item) {
                item.classList.remove(classname);
            });
        } else {
            dom.classList.remove(classname);
        }
    };

    /**
     * 是否包含classname
     * @param {HTMLElement} dom元素
     * @param {String} className
     */
    TabView.prototype.contains = function(dom, classname) {
        return dom.classList.contains(classname);
    };

    /**
     * 设置class属性
     * @param {HTMLElement or Array} dom元素或者数组
     * @param {Object} options 配置
     * property {String} 属性
     * value {String} 值
     */
    TabView.prototype.setProperty = function(dom, options) {
        var property = options.property,
            value = options.value;

        if(Array.isArray(dom)) {
            dom.forEach(function(item) {
                item.style[property] = value;
            });
        } else {
            dom.style[property] = value;
        }
    };

    /**
     * 默认实现一个siblings, 也可以暴露出来单独使用
     * @param {HTMLElement} dom元素
     * return {Array} 返回其余相邻的元素
     */
    TabView.prototype.siblings = function(dom) {
        var data = [],
            children;

        try {
            children = dom.parentNode.children
        } catch(e) {
            return;
        }

        for(var i = 0, len = children.length; i < len; i++) {

            if(dom != children[i]) {
                data.push(children[i]);
            }

        }

        return data;
    };

    /**
     * 实现滑屏
     * @param itemClick {Function} 点击函数
     */
    TabView.prototype.screenMove = function(itemClick) {
        this.currentPostion = this.currentPostion || 0; // 滑动初始位置

        var that = this,
            dom = this.dom,
            startX,
            startY,
            pageWidth = this.pageWidth,
            elBody = this.bodyEle,
            maxWidth = -pageWidth * (elBody.children.length - 1),
            moveLen = 0, // 移动距离
            initialPos = 0,
            startT = 0, // 记录按下时间
            direction = 'left', // 滑动方向
            isMove = false; // 是否发生左右滑动

        // 按下
        dom.addEventListener('touchstart', function(e) {
            var touches = e.touches[0];

            startX = touches.pageX;
            startY = touches.pageY;
            initialPos = that.currentPostion;

            elBody.style.webkitTransition = '';
            startT = +new Date();
            isMove = false;
        });

        // 滑动
        dom.addEventListener('touchmove', function(e) {
            var touches = e.touches[0],
                pageX = touches.pageX,
                pageY = touches.pageY;

            var deltaX = pageX - startX,
                deltaY = pageY - startY;

            // 如果X方向上的的位移距离大于Y方向，则代表滑动
            if(Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();

                moveLen = deltaX;
                var translate = initialPos + deltaX;

                // 超出边距
                if(translate <= 0 && translate >= maxWidth) {
                    that.transfrom(elBody, translate);
                    isMove = true;
                }

                direction = deltaX > 0 ? 'right' : 'left';
            }
        });

        // 移开屏幕
        dom.addEventListener('touchend', function(e) {
            var translate = 0,
                currentPosition = that.currentPostion,
                deltaT = +new Date() - startT;

            if(isMove) {
                elBody.style.webkitTransition = ".6s ease transform";

                if(deltaT < 300) {
                    translate = direction == 'left' ?
                        currentPosition - (pageWidth + moveLen) : currentPosition + pageWidth - moveLen;

                    translate = translate > 0 ? 0 : translate; //左边界
                    translate = translate < maxWidth ? maxWidth : translate; //右边界
                } else {
                    if(Math.abs(moveLen) / pageWidth < 0.5) {
                        translate = currentPosition - moveLen;
                    } else {
                        translate = direction == 'left' ?
                            currentPosition - (pageWidth + moveLen) : currentPosition + pageWidth - moveLen;
                        translate = translate > 0 ? 0 : translate;
                        translate = translate < maxWidth ? maxWidth : translate;
                    }
                }

                that.transfrom(elBody, translate);

                var index = Math.abs(that.currentPostion) / Math.abs(pageWidth);
                that.switchHead(index);

                itemClick.call(that.headChildEle[index], e);
            }
        });
    };

    /**
     * 头部切换
     * @param {Number} index索引值
     */
    TabView.prototype.switchHead = function(index) {
        var headChild = this.headChildEle,
            self = this,
            indexEle = headChild[index],
            siblingsEle = self.siblings(indexEle);

        self.addClass(indexEle, self.activeCls);
        self.removeClass(siblingsEle, self.activeCls);
    };

    /**
     * 平滑移动
     * @param {HTMLElement} 移动的元素
     * @param {Number} transfrom 移动的距离
     */
    TabView.prototype.transfrom = function(dom, translate) {
        dom.style.webkitTransform = "translate3d(" + translate + "px,0,0)";
        this.currentPostion = translate;
    };

    /**
     * 获取索引值
     * @param {HTMLElement} dom 当前元素
     * @param {Array} domArray 元素数组
     * return {Number} i 索引
     */
    TabView.prototype.index = function(dom, domArray) {
        for(var i = 0, len = domArray.length; i < len; i++) {
            if(dom == domArray[i]) {
                return i;
            }
        }
    };

    /**
     * 合二为一
     * @param {Object} options配置
     * @param {Object} defaultSettings 默认设置
     */
    TabView.prototype.extend = function(options, defaultSettings) {
        for(var item in defaultSettings) {
            if(options[item] === undefined) {
                this[item] = defaultSettings[item];
            } else {
                this[item] = options[item];
            }
        }
    };

    win.TabView = TabView;

}({}, document, window));