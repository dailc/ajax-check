/**
 * 作者: 戴荔春
 * 创建时间: 2017/08/04
 * 版本: [1.0, 2017/08/04 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述:  ajax校验与测试工具
 */
(function() {
    var attachfileArray = [];

    Util.loadJs([
        './libs/jquery.min.js',
        './libs/mock-min.js'
    ], [
        './libs/jsonView/jquery.jsonview.css',
        './libs/jsonView/jquery.jsonview.js'
    ], [
        './mockdata.js',
        './util.json.js',
        'js/widgets/fileinput/fileinput.js'
    ], initPage);
    
    
    function initPage() {
        initParamsSpec();
        initFileSpec();
        initMockUrl();
        initHeaderSpec();
        initRequest();
    }

    function initMockUrl() {

        // json校验相关
        var realUrl = document.querySelector('#real_url'),

            mockUrl = document.querySelector('#mock_url'),
            mockUrlP = mockUrl.parentNode,

            resultWrap = document.querySelector('#result_wrap');

        var compareChk = document.querySelector('#compare_chk'),
            compareWrap = document.querySelector('#compare_wrap');

        // 启动json校验
        compareChk.addEventListener('change', function() {
            if (this.checked) {
                mockUrlP.classList.remove('hidden');
                compareWrap.classList.remove('hidden');
                resultWrap.classList.add('result-compare');

            } else {
                mockUrlP.classList.add('hidden');
                compareWrap.classList.add('hidden');
                resultWrap.classList.remove('result-compare');
            }
        }, false);
        
        var checkWrap = $('#check_info');
        // 校验说明
        $('#btn-check-info').on('click', function() {
            checkWrap.toggleClass('hidden');
        });

    }

    function initHeaderSpec() {
        // 自定义头部相关
        var $headersWrap = $('#headers_wrap'),
            // 启动/取消 headers设置
            headersChk = document.querySelector('#headers_chk');

        headersChk.addEventListener('change', function() {
            $headersWrap.toggleClass('hidden', !this.checked);
        }, false);

        var $paramsWrap = $('#params_wrap'),
            $headersWrap = $('#headers_wrap'),
            // 参数行 模板
            paramLine = document.querySelector('#param_line_hbs').innerHTML.trim();

        // 增加参数行
        var addParamLine = function() {
            $(this).before($(paramLine));
        };

        // 删除参数行
        var delParamLine = function() {
            $(this.parentNode.parentNode).remove();
        };

        $paramsWrap.add($headersWrap)
            .on('click', '.add-line', addParamLine)
            .on('click', '.del-line', delParamLine);
    }

    function initParamsSpec() {
        // 启动、取消 以JSON字符串作为请求参数
        var $paramJsonstrChk = $('#param_jsonstr_chk'),
            $paramJsonstr = $('#param_jsonstr'),
            $paramsWrap = $('#params_wrap');

        $paramJsonstr[0].placeholder = (function() {
            var temp = {
                "name": "Andrew",
                "age": 30,
                "male": true,
                "scores": [99, 98, 110]
            };

            return '请输入合法的字符串，如：' + JSON.stringify(temp);
        }());

        $paramJsonstrChk.on('change', function() {
            $paramJsonstr.toggleClass('hidden', !this.checked);

            // 参数行、添加参数按钮 显、隐
            $paramsWrap.find('.input-group')
                .add($paramsWrap.find('.add-line'))
                .toggleClass('hidden', this.checked);
        });
    }

    /**
     * 文件配置相关
     */
    function initFileSpec() {
        // fileInput监听
        new FileInput({
            container: '#chooseH5File',
            isMulti: false,
            type: 'Image_Camera',
            success: function(b64, file, detail) {
                //console.log("fileName:" + file.name);
                appendImgFileByB64(b64, file);
            },
            error: function(error) {
                console.error(error);
            }
        });

        // 图片附件预览相关
        var attachfileItems = {};

        /**
         * 重新计算文件数组
         */
        function caculateFileArray() {
            attachfileArray = [];
            for (var item in attachfileItems) {
                attachfileItems[item] && attachfileArray.push(attachfileItems[item]);
            }
        }

        /**
         * 添加图片
         * @param {String} b64
         */
        function appendImgFileByB64(b64, file) {
            var uuid = Util.uuid();
            attachfileItems[uuid] = {
                name: 'file' + uuid,
                file: file
            };
            caculateFileArray();
            //添加图片预览
            appendImg(b64, uuid);
        }
        /**
         * 添加图片有关,获得图片模板
         * @param {String} path 路径
         * @param {String} uuid uuid
         */
        function getImgHtmlByPath(path, uuid) {

            var imgLitemplate =
                '<div class="mui-pull-left pic-div add-img" uuid="' + uuid + '"><img class="img-photo"src="' + path + '" data-preview-src="" data-preview-group="1"/><div class="closeLayer "><img src="./images/delete_error.png"class="plus-pic"/></div></div>';
            return imgLitemplate;
        };
        /**
         * @description 将图片添加进入容器中显示
         * @param {String} path 路径
         * @param {String} uuid uuid
         */
        function appendImg(path, uuid) {
            var html = getImgHtmlByPath(path, uuid);
            var dom = document.getElementById('img-group');
            var child = Util.parseHtml(html);
            dom.appendChild(child);
        }

        // 启动/取消 文件设置
        var filesChk = document.querySelector('#files_chk'),
            $fileWrap = $('#files_wrap'),
            $imgsWrap = $('#imgs_wrap'),
            $filesTips = $('#files_tips');

        filesChk.addEventListener('change', function() {
            $fileWrap.toggleClass('hidden', !this.checked);
            $filesTips.toggleClass('hidden', !this.checked);
        }, false);

        // 预览图片关闭
        $($imgsWrap).on('click', '.closeLayer', function() {
            var uuid = this.parentNode.getAttribute('uuid') || '';
            attachfileItems[uuid] = null;
            caculateFileArray();
            //移除
            var imgItemDom = this.parentNode;
            imgItemDom.parentNode.removeChild(imgItemDom);
        });
    }

    function initRequest() {
        // 请求方式：get|post
        var realUrl = document.querySelector('#real_url'),
            mockUrl = document.querySelector('#mock_url'),
            reqMethod = document.querySelector('#req_method'),
            $headersWrap = $('#headers_wrap'),
            // 启动/取消 headers设置
            headersChk = document.querySelector('#headers_chk'),
            $paramJsonstrChk = $('#param_jsonstr_chk'),
            $paramJsonstr = $('#param_jsonstr'),
            $paramsWrap = $('#params_wrap'),
            filesChk = document.querySelector('#files_chk'),
            resultWrap = document.querySelector('#result_wrap'),
            compareChk = document.querySelector('#compare_chk'),
            compareWrap = document.querySelector('#compare_wrap');

        var $realJson = $('#real_json'),
            $realStatus = $realJson.prev().find('.req-status'),

            $mockJson = $('#mock_json'),
            $mockStatus = $mockJson.prev().find('.req-status');

        /**
         * 获取参数键值对
         * @param {Object} $wrap
         */
        function getParams($wrap) {
            var params = {};

            var $groups = $wrap.find('.input-group');

            if (!$groups.length) return;

            $groups.each(function(i, el) {
                var inputs = el.querySelectorAll('input[type="text"]'),

                    key = inputs[0].value.trim(),
                    value = inputs[1].value.trim();

                if (key !== '') {
                    params[key] = value;
                }
            });

            return params;
        }

        function updateReqStatus(tag, text, cls) {
            var $status = tag === 'real' ? $realStatus : $mockStatus;

            $status.html(text)
                .removeClass()
                .addClass(cls);
        }

        /**
         * 绘制返回json
         * @param {Object} tag
         * @param {Object} json
         */
        function renderJSON(tag, json) {
            var $con = tag === 'real' ? $realJson : $mockJson;
            $con.JSONView(json, {
                strict: true
            });
        }

        /**
         * 发送ajax请求
         * @param {Object} tag
         */
        function sendAjax(tag) {
            var url = tag === 'real' ?
                realUrl.value.trim() :
                mockUrl.value.trim();

            if (!url) {
                updateReqStatus(tag, '请先配置请求url', 'text-danger');

                return Promise.reject();
            }

            var params = getParams($paramsWrap);
            var type = reqMethod.value;
            var headers = headersChk.checked ? getParams($headersWrap) : null;

            return Util.ajax({
                url: url,
                type: type,
                dataType: 'json',
                // 根据勾选条件，采用不同的参数形式
                data: $paramJsonstrChk[0].checked ? $paramJsonstr[0].value.trim() : params,
                headers: headers,
                beforeSend: function() {
                    updateReqStatus(tag, '请求中...', 'text-info');
                },
                error: null
            }).then(function(data) {
                var result = data ? data : '{"error": "response内容为空"}';

                try {
                    if (typeof result !== 'object') {
                        result = JSON.parse(result);
                    }
                    renderJSON(tag, result);
                    updateReqStatus(tag, '200', 'text-success');
                } catch (e) {
                    console.error("错误,返回的数据格式不对:" + result);
                    renderJSON(tag, {
                        formaterror: JSON.stringify(result)
                    });
                    updateReqStatus(tag, '200', 'text-danger');
                }
                
                return Promise.resolve(data);

            }).catch(function(err) {
                updateReqStatus(tag, err.xhr.status + ' ' + err.error, 'text-danger');
                err.xhr = err.xhr.responseText;
                err.error = JSON.stringify(err.xhr);
                renderJSON(tag, err);
            })
        }

        /**
         * 发送文件上传请求
         * @param {Object} tag
         */
        function sendUploadAjax(tag) {
            var url = tag === 'real' ?
                realUrl.value.trim() :
                mockUrl.value.trim();

            if (!url) {
                updateReqStatus(tag, '请先配置请求url', 'text-danger');

                return Promise.reject();
            }

            if (attachfileArray.length <= 0) {
                updateReqStatus(tag, '上传的文件不能为空', 'text-danger');
                return Promise.reject();
            }

            var params = getParams($paramsWrap);

            return Util.upload({
                xhr: function() {
                    // 采用了mock，会被污染
                    return new window._XMLHttpRequest();  
                },
                url: 'http://115.29.151.25:8012/webUploaderServer/testUpload.php',
                data: $paramJsonstrChk[0].checked ? $paramJsonstr[0].value.trim() : params,
                files: attachfileArray,
                beforeSend: function() {
                    updateReqStatus(tag, '准备上传', 'text-info');
                },
                success: function(response, status, xhr) {
                    response = response || '{"error": "response内容为空"}';
                    try {
                        if (typeof response !== 'object') {
                            response = JSON.parse(response);
                        }
                        renderJSON(tag, response);
                        updateReqStatus(tag, '200', 'text-success');
                    } catch (e) {
                        console.error("错误,返回的数据格式不对:" + response);
                        renderJSON(tag, {
                            formaterror: JSON.stringify(response)
                        });
                        updateReqStatus(tag, '200', 'text-danger');
                    }

                },
                error: function(xhr, status, statusText) {
                    detail = detail || '上传文件失败!';
                    var result = {
                        detail: detail,
                        msg: msg
                    };
                    renderJSON(tag, result);
                    updateReqStatus(tag, '上传失败', 'text-danger');
                },
                uploading: function(percent, speed, status) {
                    updateReqStatus(tag, "上传中:" + percent + ',msg:' + status + ',speed:' + speed, 'text-info');
                    console.log("上传中:" + percent + ',speed:' + speed + ',msg:' + status);
                }
            });
        }

        // 点击“发送请求”
        $(resultWrap).on('click', '.send-btn', function() {
            var self = this;
            var tag = this.dataset.tag;
            if (self.classList.contains('loading')) return;

            self.classList.add('loading');
            if ($(filesChk).is(':checked')) {
                //如果选择了附件
                sendUploadAjax(tag).catch(function(error) {
                    console.error(error);
                }).finally(function(error) {
                    self.classList.remove('loading');
                });

            } else {
                //普通请求
                sendAjax(tag).catch(function(error) {
                    console.error(error);
                }).finally(function(error) {
                    self.classList.remove('loading');
                });
            }

        });

        var JsonChkLog = {
            _$el: $(compareWrap.querySelector('.panel-body')),

            _log: function(text, tag) {
                var cls = tag ? ('text-' + tag) : '',
                    type = Util.json.JsonAnalysis.getTypeof(text),

                    $content = null;

                if (type === 'string') {
                    $content = $('<p>' + text + '</p>');

                } else if (type === 'array') {
                    var html = [];

                    text.forEach(function(line, i) {
                        html.push('<p>' + line + '</p>');
                    });

                    $content = $('<div>' + html.join('') + '</div>');
                }

                $content.addClass(cls).appendTo(this._$el);
            },

            error: function(text) {
                this._log(text, 'danger');
            },

            ok: function(text) {
                this._log(text, 'success');
            },

            warn: function(text) {
                this._log(text, 'warning');
            },

            log: function(text) {
                this._log(text);
            },

            clear: function() {
                this._$el.html('');
            }
        };

        // 校验条件是否满足
        var isJsonChkReady = function(json, tag) {
            var prefix = tag === 'real' ? '真实' : 'MOCK',
                rt = true;

            if (!json) {
                JsonChkLog.error(prefix + '请求无返回值，无法校验');
                rt = false;

            } else if (Util.json.JsonAnalysis.analysis(json).keyNames.join('').indexOf('_empty_') !== -1) {
                JsonChkLog.error(prefix + '数据中存在 空数组 或 空对象，无法有效校验，请重试');
                rt = false;
            }

            return rt;
        };

        // 点击“一键校验”
        $(compareWrap).on('click', '.chk-btn', function() {
            var self = this;

            if (this.classList.contains('loading')) return;

            this.classList.add('loading');
            //默认是普通请求
            var isUpload = false;
            var defFunc = sendAjax;
            if ($(filesChk).is(':checked')) {
                defFunc = sendUploadAjax;
                isUpload = true;
            }

            Promise.all([defFunc('real'), defFunc('mock')]).then(function(arg) {
                var real = arg[0],
                    mock = arg[1];
                // 清除之前的输出
                JsonChkLog.clear();

                /**
                 * 如果满足校验条件，则校验
                 * 1. json数据不能为空
                 * 2. json数据中不存在空对象、空数组的情况
                 */
                if (isJsonChkReady(real, 'real') && isJsonChkReady(mock, 'mock')) {

                    /**
                     * 目前的算法要正确运行的话，有个条件。
                     * 即mock定义的数据，json字段名在不同数据路径上，表述同一意义的，命名应该保持一致，如：
                     * "member": {
                     *     "userName": "Andrew",
                     *     "phoneNo": "13815622456",
                     *     "contacts": [{
                     *         "userName": "lucy",
                     *         "phoneNo": "15896548562"
                     *     }]
                     * }
                     * member.userName 与 member.contacts[].userName 命名一致
                     */
                    var result = Util.json.jsonCheck(real, mock);
                    console.log("检查结果:" + JSON.stringify(result));

                    if (result.code) {
                        JsonChkLog.ok('真实数据 与 MOCK数据 匹配成功！');
                        return;
                    } else {
                        JsonChkLog.error(result.description);
                        JsonChkLog.log(result.data);
                    }

                }

            }).catch(function(error) {
                JsonChkLog.error('真实请求 或 mock请求 存在异常，请检查');
                console.error(error);
            }).finally(function() {
                self.classList.remove('loading');
            });
        });
    }

})();