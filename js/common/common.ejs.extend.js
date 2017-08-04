/**
 * 作者: 戴荔春
 * 创建时间: 2017/08/03
 * 版本: [1.0, 2017/08/03 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: ejs api拓展
 */

(function() {
    
    if (Config.ejsVer != 3) {
        return ;
    }
    
    var oldGetToken = ejs.auth.getToken;
    
    /**
     * 拓展getToken API
     */
    ejs.extendApi('auth', {
        namespace: "getToken",
        os: ['h5'],
        runCode: function() {
            // TODO: 额外的逻辑           
            
            oldGetToken.apply(this, arguments);
        }
    });

})();