// ==UserScript==
// @name         修改我的B站显示效果
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  try to take over the world!
// @author       onble
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://static.thenounproject.com/png/3355755-200.png
// @grant        GM_addStyle
// @run-at document-start
// ==/UserScript==
function stretch_vodeo_choose_list() {
    const video_list = document.querySelector(".list-box");
    if (!video_list) {
        console.log("--->没有找到视频选集<---");
        return;
    }
    console.log("--->找到了视频选集<---");
    //选中下面的推荐视频列表
    const recommend_list = document.querySelector("#reco_list");
    // 查找需求的最大高度
    const need_height = video_list.scrollHeight;
    // 计算可扩展高度
    let expandable_height = window.innerHeight - recommend_list.offsetTop + 340; // TODO: 340是推测的数据，需要再验证
    if (expandable_height > need_height) {
        expandable_height = need_height; // 如果可以扩展的空间大于需求，则根据需求大小进行扩展
    }
    // console.log("video_list.childElementCount", video_list.childElementCount);
    GM_addStyle(`
        .cur-list>ul{
                height: ${expandable_height}px !important;
                max-height: none !important;
        }`);
}
function stretch_collection() {
    // 这个函数的作用是控制视频合集列表的的高度，列表数量多时候，使列表高度的底部到屏幕底端，少的时候根据列表数量弹性增长
    //选中选集列表
    const collection_list = document.querySelector(
        "div.video-sections-content-list"
    );
    if (!collection_list) {
        //这一页没有列表元素
        console.log("--->这一页没有列表元素<---");
        // 此时找不到合集列表，找找有没有视频选集
        stretch_vodeo_choose_list();
        return;
    }
    console.log("--->找到了视频列表元素<---");
    //选中下面的推荐视频列表
    const recommend_list = document.querySelector("#reco_list");
    // 计算可扩展高度
    let expandable_height =
        window.innerHeight -
        recommend_list.offsetTop +
        parseInt(collection_list.style.height);
    if (window.isNaN(expandable_height)) {
        expandable_height = window.innerHeight - recommend_list.offsetTop + 243;
        console.log("--->行内样式没有写height,所以按照243赋值<---");
    }
    //下面是对合集较少的时候进行处理
    // 有个常数6是推测的
    const list_actual_height =
        document.querySelector("div.video-section-list.section-0")
            .scrollHeight + 6;
    if (expandable_height > list_actual_height) {
        expandable_height = list_actual_height;
    }
    GM_addStyle(`
    div.video-sections-content-list{
        height: ${expandable_height}px !important;
        max-height: none !important;
    }
    `);
}
function stop_single_page_continuously_play() {
    // 这个函数的作用是停止单视频的自动连播，这样不影响合集视频的自动连播
    // 原来的判断是否是单视频的逻辑有问题，被弃用
    // 监听视频播放完毕
    const elevideo = document.querySelector("video");
    elevideo.addEventListener("ended", function () {
        const cancel_continuously_play_button = document.querySelector(
            ".bpx-player-ending-related-item-cancel"
        );
        if (!cancel_continuously_play_button) {
            return;
        }
        cancel_continuously_play_button.click();
    });
}
function del_video_page_special_card() {
    // 这个函数用来去除三个在视频页面的广告
    // 右下角的广告应该也是和Vue相关联，所以使用样式进行禁止显示
    // 依次为
    // 右下角视频推荐第一个
    // 右下角推荐视频的后面大广告
    // 右边栏最后的直播
    // 弹幕下面的小广告
    // 弹幕下面的新增加的小广告
    // 弹幕下面的大广告
    GM_addStyle(`
    .video-page-special-card {
        display: none;
    }
    #right-bottom-banner {
        display: none;
    }
    #live_recommand_report {
        display: none;
    }
    #slide_ad {
        display: none;
    }
    .video-ad-creative-card{
        display: none;
    }
    .ad-report{
        display: none !important;
    }
    `);
}
function clean_top_nav() {
    // 因为顶部导航栏的一些功能不常用，所以进行清理
    // 注意：这个函数现在是基于旧版只有文字的网页进行清理
    // 两个不同的版本，在进行style样式设置时候冲突不大
    // 首先清理用不到的垃圾入口
    GM_addStyle(`
    .nav-link-ul>li:not(:nth-child(1)) {
        display: none;
    }
    `);
    // 然后清理搜素框
    GM_addStyle(`
    #nav_searchform>input::placeholder {
        color: rgba(0,0,0,0);
    }
    `);
    // TODO: 应该尝试如何抓取异步加入的搜索框
    // 清理搜素框中的热搜
    GM_addStyle(`
    .trending {
        display: none;
    }
    `);
    // 清理右边的大会员
    GM_addStyle(`
    .user-con.signin>div:nth-child(2) {
        display: none;
    }
    `);
    // 清理创作中心与投稿
    GM_addStyle(`
    .user-con.signin>div:nth-child(7) {
        display: none;
    }
    `);
    //清除小红点
    GM_addStyle(`
    div.num {
        display: none;
    }
    `);
}
function new_clean_top_nav() {
    // 这个是对B站新版网页进行清理上面的导航栏
    GM_addStyle(`
    .left-entry>li:not(:nth-child(1)) {
        display: none;
    }
    `);
}
function display_charge_button() {
    GM_addStyle(`
    div[report-id="charge"] {
        display: none !important;
    }
    `);
}
(function () {
    "use strict";

    clean_top_nav();
    new_clean_top_nav();
    del_video_page_special_card();
    // 因为上面的清理广告函数会影响右边栏目的高度，所以要注意这个函数与stretch_collection函数的先后顺序

    display_charge_button();
    const oldOnload = window.onload;
    window.onload = function () {
        // 这里面放晚加载的函数
        if (oldOnload) {
            oldOnload();
        }

        stretch_collection();
        stop_single_page_continuously_play();
    };
})();
