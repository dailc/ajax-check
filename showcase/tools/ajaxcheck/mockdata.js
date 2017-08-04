Mock.mock('/jsoncheck/real', {
    "reply|1-3": [{
        "content": "@cword(20,30)",
        "img": "@image('30x30')",
        "replyId": "@guid",
        "replyTime": "@time('HH:mm')",
        "replysub|0-3": [{
            "content": "@cword(10,20)",
            "img": "@image('30x30')",
            "replyId": "@guid",
            "replyTime": "@time('HH:mm')",
            "rpUserId": "@guid",
            "rpUserName": "@cname",
            "userId": "@guid",
            "userName": "@cname"
        }],
        "userId": "@guid",
        "userName": "@cname"
    }],
    "trends": {
        "browse": "@natural(1,100)",
        "content": "@cword(10,30)",
        "img": "@image('50x50')",
        "like": {
            "item|2-4": [{
                "img": "@image('30x30')",
                "userId": "@guid"
            }],
            "number": "@natural(1,10)"
        },
        "number": "@natural(1,10)",
        "time": "@time('hh:ss')",
        "trendsId": "@guid",
        "userId": "@guid",
        "userName": "@cname"
    }
});

//Mock.mock('/jsoncheck/mock', {
//  "reply|1-3": [{
//      "content": "@cword(20,30)",
//      "img": "@image('30x30')",
//      "replyId": "@guid",
//      "replyTime": "@time('HH:mm')",
//      "replysub|0-3": [{
//          "content": "@cword(10,20)",
//          "img": "@image('30x30')",
//          "replyId": "@guid",
//          "replyTime": "@time('HH:mm')",
//          "rpuserId": "@guid",
//          "rpuserName": "@cname",
//          "userId": "@guid",
//          "userName": "@cname"
//      }],
//      "userId": "@guid",
//      "userName": "@cname"
//  }],
//  "trends": {
//      "browse": "@natural(1,100)",
//      "content": "@cword(10,30)",
//      "img": "@image('50x50')",
//      "like": {
//          "item|2-4": [{
//              "img": "@image('30x30')",
//              "userId": "@guid",
//              "userName": "@cname"
//          }],
//          "number": "@natural(1,10)"
//      },
//      "number": "@natural(1,10)",
//      "time": "@time('hh:ss')",
//      "trendsId": "@guid",
//      "userId": "@guid",
//      "userName": "@cname"
//  }
//});
Mock.mock('/jsoncheck/mock', {
    "reply|1-3": [{
        "content": "@cword(20,30)",
        "img": "@image('30x30')",
        "replyId": "@guid",
        "replyTime": "@time('HH:mm')",
        "replysub|0-3": [{
            "content": "@cword(10,20)",
            "img": "@image('30x30')",
            "replyId": "@guid",
            "replyTime": "@time('HH:mm')",
            "rpUserId": "@guid",
            "rpUserName": "@cname",
            "userId": "@guid",
            "userName": "@cname"
        }],
        "userId": "@guid",
        "userName": "@cname"
    }],
    "trends": {
        "browse1": "@natural(1,100)",
        "content": "@cword(10,30)",
        "img": "@image('50x50')",
        "like": {
            "item|2-4": [{
                "img": "@image('30x30')",
                "userId": "@guid"
            }],
            "number": "@natural(1,10)"
        },
        "number": "@natural(1,10)",
        "time": "@time('hh:ss')",
        "trendsId": "@guid",
        "userId": "@guid"
    }
});