var PostData = (function () {
    function PostData() {
    }
    return PostData;
}());
var Posts = (function () {
    function Posts() {
    }
    Posts.ALL = [
        { filename: "03-01-2015", tags: ["underrated", "managers", "part", "1", "unai", "emery"] },
        { filename: "16-01-2015", tags: ["underrated", "managers", "part", "2", "francesco", "guidolin"] },
        { filename: "04-06-2016", tags: ["underrated", "managers", "part", "3", "leonardo", "jardim"] },
        { filename: "04-11-2016", tags: ["shkodran", "mustafi", "good", "bad", "ugly"] }
    ];
    Posts.WRITEUPS = [
        { filename: "03-01-2015", tags: ["underrated", "managers", "part", "1", "unai", "emery"] },
        { filename: "16-01-2015", tags: ["underrated", "managers", "part", "2", "francesco", "guidolin"] },
        { filename: "04-06-2016", tags: ["underrated", "managers", "part", "3", "leonardo", "jardim"] },
        { filename: "04-11-2016", tags: ["shkodran", "mustafi", "good", "bad", "ugly"] }
    ];
    Posts.PLAYERS = [
        { filename: "", tags: [""] }
    ];
    Posts.BETTING = [
        { filename: "", tags: [""] }
    ];
    return Posts;
}());
var Browser = (function () {
    function Browser() {
    }
    Browser.IS_OPERA = window.navigator.userAgent.indexOf("OPR") > -1;
    Browser.IS_EDGE = window.navigator.userAgent.indexOf("Edge") > -1;
    Browser.IS_IOS_CHROME = window.navigator.userAgent.match("CriOS");
    Browser.IS_CHROME = window.chrome !== null && window.chrome !== undefined && window.navigator.vendor === "Google Inc." && !Browser.IS_OPERA && !Browser.IS_EDGE;
    return Browser;
}());
var LoadingIcon = (function () {
    function LoadingIcon(parentElement) {
        this.parentElement = parentElement;
        var wrapper = this.wrapper = document.createElement("div");
        wrapper.classList.add("spinnerWrapper");
        var spinnerPart1 = document.createElement("div");
        spinnerPart1.classList.add("spinnerPart1");
        wrapper.appendChild(spinnerPart1);
        var spinnerPart2 = document.createElement("div");
        spinnerPart2.classList.add("spinnerPart2");
        wrapper.appendChild(spinnerPart2);
        var spinnerPart3 = document.createElement("div");
        spinnerPart3.classList.add("spinnerPart3");
        wrapper.appendChild(spinnerPart3);
    }
    LoadingIcon.prototype.append = function () {
        this.parentElement.appendChild(this.wrapper);
    };
    LoadingIcon.prototype.remove = function () {
        if (!this.parentElement.contains(this.wrapper)) {
            return;
        }
        this.parentElement.removeChild(this.wrapper);
    };
    return LoadingIcon;
}());
var PostObject = (function () {
    function PostObject() {
    }
    return PostObject;
}());
var PostManager = (function () {
    function PostManager() {
        this.posts = document.getElementsByClassName("posts")[0];
        this.resultsFound = document.getElementsByClassName("resultsFound")[0];
        this.pageIconContainer = document.getElementsByClassName("pageIconContainer")[0];
        this.postContainers = [];
        this.postsLoadingIcon = new LoadingIcon(this.posts);
        this.previewsLoadedCount = 0;
        this.previewsInMemory = [];
        for (var i = 0; i < PostManager.POST_LOAD_COUNT; i++) {
            var container = document.createElement("div");
            container.classList.add("postContainer");
            this.posts.insertBefore(container, this.pageIconContainer);
            this.postContainers.push(container);
        }
    }
    PostManager.prototype.setPostsData = function (postsData) {
        this.postsData = postsData;
    };
    PostManager.prototype.load = function (skipPreLoad, startIndex) {
        if (skipPreLoad === void 0) { skipPreLoad = false; }
        if (startIndex === void 0) { startIndex = 0; }
        this.emptyPage();
        this.postsLoadingIcon.append();
        if (!skipPreLoad) {
            this.preLoad();
        }
        if (this.matches && this.matches.length > 0) {
            this.requestContent(startIndex);
        }
        else {
            this.resultsFound.classList.remove("hidden");
        }
    };
    PostManager.prototype.emptyPage = function () {
        var postContainers = document.getElementsByClassName("postContainer");
        for (var i = 0; i < postContainers.length; i++) {
            postContainers[i].innerHTML = "";
            this.previewsLoadedCount = 0;
            this.loadedPreviews = [];
        }
        this.resultsFound.classList.add("hidden");
        this.pageIconContainer.innerHTML = "";
    };
    PostManager.prototype.preLoad = function () {
        var rawPreviewsToLoadCount = this.rawPreviewsToLoadCount = this.postsData.length;
        this.previewsToLoadCount = rawPreviewsToLoadCount >= PostManager.POST_LOAD_COUNT ? PostManager.POST_LOAD_COUNT : rawPreviewsToLoadCount;
        var rawSearchTerm = window.location.search.substring(1).toLowerCase();
        var searchTerms = rawSearchTerm.split("%20");
        this.matches = [];
        for (var i = 0; i < rawPreviewsToLoadCount; i++) {
            if (!this.postsData[i]) {
                return;
            }
            var matchFound = true;
            for (var _i = 0, searchTerms_1 = searchTerms; _i < searchTerms_1.length; _i++) {
                var searchTerm = searchTerms_1[_i];
                var postTags = this.postsData[i].tags;
                var termMatchFound = false;
                for (var _a = 0, postTags_1 = postTags; _a < postTags_1.length; _a++) {
                    var tag = postTags_1[_a];
                    if (tag.indexOf(searchTerm) > -1) {
                        termMatchFound = true;
                        break;
                    }
                }
                if (!termMatchFound) {
                    matchFound = false;
                    break;
                }
            }
            if (!matchFound) {
                this.previewsLoadedCount++;
                if (this.previewsLoadedCount >= this.rawPreviewsToLoadCount) {
                    this.handleAfterPreviewLoad();
                }
                continue;
            }
            this.matches.push(this.postsData[i].filename + ".html");
        }
    };
    PostManager.prototype.requestContent = function (startIndex) {
        var _this = this;
        var _loop_1 = function (i) {
            if (!this_1.matches[i]) {
                return { value: void 0 };
            }
            var previewFoundInMemory = void 0;
            for (var _i = 0, _a = this_1.previewsInMemory; _i < _a.length; _i++) {
                var previewInMemory = _a[_i];
                if (previewInMemory.filename === this_1.matches[i]) {
                    previewFoundInMemory = previewInMemory;
                    break;
                }
            }
            if (previewFoundInMemory) {
                this_1.loadPreviews(previewFoundInMemory.html, i, i - startIndex);
            }
            else {
                this_1.httpRequest(PostManager.PREVIEWS_DIRECTORY + this_1.matches[i], function (response) { return _this.loadPreviews(response, i, i - startIndex, _this.matches[i]); });
            }
        };
        var this_1 = this;
        for (var i = startIndex; i < startIndex + PostManager.POST_LOAD_COUNT; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    PostManager.prototype.loadPreviews = function (html, rawIndex, index, filename) {
        if (filename) {
            this.previewsInMemory.push({ filename: filename, html: html });
        }
        var postWrapper = document.createElement("div");
        postWrapper.classList.add("postWrapper");
        var indexElement = document.createElement("span");
        indexElement.classList.add("hidden");
        indexElement.innerText = rawIndex.toString();
        postWrapper.appendChild(indexElement);
        postWrapper.innerHTML += html;
        var footer = document.createElement("div");
        footer.classList.add("postFooter");
        footer.innerText = "Read More";
        postWrapper.appendChild(footer);
        this.loadedPreviews.push({ element: postWrapper, i: index });
        this.previewsLoadedCount++;
        if (this.previewsLoadedCount >= this.previewsToLoadCount) {
            this.handleAfterPreviewLoad();
        }
    };
    PostManager.prototype.handleAfterPreviewLoad = function () {
        var _this = this;
        this.postsLoadingIcon.remove();
        for (var _i = 0, _a = this.loadedPreviews; _i < _a.length; _i++) {
            var loadedPreview = _a[_i];
            this.postContainers[loadedPreview.i].appendChild(loadedPreview.element);
        }
        var footers = document.getElementsByClassName("postFooter");
        var _loop_2 = function (i) {
            var footerElement = footers[i];
            footerElement.addEventListener("click", function () { return _this.togglePostExpansion(footerElement); });
        };
        for (var i = 0; i < footers.length; i++) {
            _loop_2(i);
        }
        var links = document.getElementsByClassName("postHeaderLink");
        var _loop_3 = function (i) {
            var linkElement = links[i];
            linkElement.addEventListener("click", function () {
                var hiddenInputElement = linkElement.parentElement.lastElementChild;
                hiddenInputElement.classList.remove("hidden");
                hiddenInputElement.select();
                document.execCommand("copy");
                hiddenInputElement.classList.add("hidden");
            });
        };
        for (var i = 0; i < links.length; i++) {
            _loop_3(i);
        }
        var rawPreviewCount = (window.location.search && window.location.search !== "") ? this.matches.length : this.rawPreviewsToLoadCount;
        var pagesRequiredCount = Math.ceil(rawPreviewCount / PostManager.POST_LOAD_COUNT);
        for (var i = 0; i < pagesRequiredCount; i++) {
            var pageIcon = document.createElement("span");
            pageIcon.classList.add("pageIcon");
            pageIcon.innerText = (i + 1).toString();
            this.pageIconContainer.appendChild(pageIcon);
            pageIcon.addEventListener("click", function (e) {
                var clickedNumber = e.target.innerText;
                _this.load(true, (+clickedNumber - 1) * PostManager.POST_LOAD_COUNT);
            });
        }
    };
    PostManager.prototype.togglePostExpansion = function (footerElement) {
        var _this = this;
        var parentElement = footerElement.parentElement;
        var postIndex = +parentElement.firstElementChild.innerText;
        var postContent = parentElement.getElementsByClassName("content")[0];
        if (footerElement.innerText === "Read More") {
            footerElement.innerText = "Read Less";
            if (postContent.innerHTML === "") {
                this.httpRequest(PostManager.POSTS_DIRECTORY + this.matches[postIndex], function (response) { return _this.loadPostContent(response, postContent); });
            }
            else {
                postContent.classList.remove("hidden");
            }
        }
        else {
            footerElement.innerText = "Read More";
            postContent.classList.add("hidden");
        }
    };
    PostManager.prototype.loadPostContent = function (html, postBody) {
        postBody.innerHTML += html;
    };
    PostManager.prototype.httpRequest = function (url, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                callback(xmlHttp.responseText);
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    };
    PostManager.LOCAL_SERVER = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    PostManager.PREVIEWS_DIRECTORY = PostManager.LOCAL_SERVER ? "/josh-website/assets/previews/" : "/assets/previews/";
    PostManager.POSTS_DIRECTORY = PostManager.LOCAL_SERVER ? "/josh-website/assets/posts/" : "/assets/posts/";
    PostManager.ACTIVE_TAB_CLASS = "tab-active";
    PostManager.FIXED_TOP_BAR_CLASS = "topBarWrapper-fixed";
    PostManager.POST_LOAD_COUNT = 5;
    return PostManager;
}());
var TabManager = (function () {
    function TabManager() {
        var _this = this;
        this.tabs = document.getElementsByClassName("tab");
        this.allTab = this.tabs[0];
        this.writeupsTab = this.tabs[1];
        this.playersTab = this.tabs[2];
        this.bettingTab = this.tabs[3];
        this.horizontalSeperator = document.getElementsByClassName("horizontalSeperator")[0];
        this.postManager = new PostManager();
        for (var i = 0; i < this.tabs.length; i++) {
            this.tabs[i].addEventListener("click", function (e) {
                var targetElement = e.target;
                if (!targetElement.classList.contains("tab")) {
                    targetElement = targetElement.parentElement;
                }
                window.location.href = "#content";
                window.location.search = "";
                _this.setActiveTab(targetElement);
            });
        }
        this.setActiveTab(this.allTab);
    }
    TabManager.prototype.setActiveTab = function (clickedTab) {
        if (clickedTab === this.activeTab) {
            return;
        }
        if (this.activeTab) {
            this.activeTab.classList.remove("tab-active");
        }
        clickedTab.classList.add("tab-active");
        this.activeTab = clickedTab;
        var postsData = [];
        if (clickedTab === this.allTab) {
            postsData = Posts.ALL;
        }
        else if (clickedTab === this.writeupsTab) {
            postsData = Posts.WRITEUPS;
        }
        else if (clickedTab === this.playersTab) {
            postsData = Posts.PLAYERS;
        }
        else if (clickedTab === this.bettingTab) {
            postsData = Posts.BETTING;
        }
        this.postManager.setPostsData(postsData);
        this.postManager.load();
    };
    return TabManager;
}());
var SearchBar = (function () {
    function SearchBar() {
        var _this = this;
        this.searchField = document.getElementsByClassName("searchField")[0];
        this.searchField.addEventListener("keypress", function (e) {
            var keyCode = e.which || e.keyCode;
            if (keyCode !== 13) {
                return;
            }
            window.location.hash = "#content";
            window.location.search = _this.searchField.value;
        });
    }
    return SearchBar;
}());
var TopBar = (function () {
    function TopBar() {
        var _this = this;
        this.nav = document.getElementsByClassName("nav")[0];
        this.topBarWrapper = document.getElementsByClassName("topBarWrapper")[0];
        this.rightSideWrapper = document.getElementsByClassName("rightSideWrapper")[0];
        this.pageTitle = document.getElementsByClassName("pageTitle")[0];
        this.logo = document.getElementsByClassName("logo")[0];
        this.searchWrapper = document.getElementsByClassName("searchWrapper")[0];
        this.search = document.getElementsByClassName("search")[0];
        this.twitterIconWrapper = document.getElementsByClassName("twitterIconWrapper")[0];
        this.twitterIcon = document.getElementsByClassName("twitterIcon")[0];
        this.fixedBarAnchor = document.getElementsByClassName("horizontalSeperator")[0];
        this.topBar = document.getElementsByClassName("topBar")[0];
        this.landing = document.getElementsByClassName("landing")[0];
        this.scroll = document.getElementsByClassName("scroll")[0];
        this.isFixed = false;
        this.preFixedTop = 0;
        if (Browser.IS_CHROME) {
            this.twitterIcon.classList.add("twitterIcon-center");
        }
        window.addEventListener("scroll", function () { return _this.fix(); });
        this.fix();
    }
    TopBar.prototype.fix = function () {
        var navTop = this.nav.offsetTop;
        if (!this.isFixed && navTop < window.pageYOffset) {
            this.isFixed = true;
            this.preFixedTop = navTop;
            this.topBarWrapper.classList.add("topBarWrapper-fixed");
            this.rightSideWrapper.removeChild(this.pageTitle);
            this.topBarWrapper.removeChild(this.logo);
            this.searchWrapper.appendChild(this.search);
            this.twitterIconWrapper.appendChild(this.twitterIcon);
            this.fixedBarAnchor.appendChild(this.topBarWrapper);
        }
        else if (this.isFixed && this.preFixedTop > window.pageYOffset) {
            this.isFixed = false;
            this.topBarWrapper.classList.remove("topBarWrapper-fixed");
            this.rightSideWrapper.insertBefore(this.pageTitle, this.topBar);
            this.rightSideWrapper.appendChild(this.search);
            this.topBarWrapper.insertBefore(this.logo, this.rightSideWrapper);
            this.nav.appendChild(this.twitterIcon);
            this.landing.appendChild(this.topBarWrapper);
            this.landing.appendChild(this.scroll);
        }
        this.landing.style.opacity = (1 - window.pageYOffset / window.innerHeight).toString();
    };
    return TopBar;
}());
var Website = (function () {
    function Website() {
        new TabManager();
        new SearchBar();
        new TopBar();
    }
    return Website;
}());
new Website();
