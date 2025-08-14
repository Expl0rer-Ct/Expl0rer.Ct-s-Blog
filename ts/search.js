(() => {
  // <stdin>
  var tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "\u2026": "&hellip;"
  };
  function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
  }
  function replaceHTMLEnt(str) {
    return str.replace(/[&<>"]/g, replaceTag);
  }
  function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
  }
  var Search = class _Search {
    data;
    form;
    input;
    list;
    resultTitle;
    resultTitleTemplate;
    constructor({ form, input, list, resultTitle, resultTitleTemplate }) {
      this.form = form;
      this.input = input;
      this.list = list;
      this.resultTitle = resultTitle;
      this.resultTitleTemplate = resultTitleTemplate;
      if (this.input.value.trim() !== "") {
        this.doSearch(this.input.value.split(" "));
      } else {
        this.handleQueryString();
      }
      this.bindQueryStringChange();
      this.bindSearchForm();
    }
    /**
     * 处理搜索匹配结果
     */
    static processMatches(str, matches, ellipsis = true, charLimit = 140, offset = 20) {
      if (matches.length === 0) return replaceHTMLEnt(str.substring(0, charLimit));
      matches.sort((a, b) => a.start - b.start);
      let i = 0, lastIndex = 0, charCount = 0;
      const resultArray = [];
      while (i < matches.length) {
        const item = matches[i];
        if (ellipsis && item.start - offset > lastIndex) {
          resultArray.push(`${replaceHTMLEnt(str.substring(lastIndex, lastIndex + offset))} [...] `);
          resultArray.push(`${replaceHTMLEnt(str.substring(item.start - offset, item.start))}`);
          charCount += offset * 2;
        } else {
          resultArray.push(replaceHTMLEnt(str.substring(lastIndex, item.start)));
          charCount += item.start - lastIndex;
        }
        let j = i + 1, end = item.end;
        while (j < matches.length && matches[j].start <= end) {
          end = Math.max(matches[j].end, end);
          j++;
        }
        resultArray.push(`<mark>${replaceHTMLEnt(str.substring(item.start, end))}</mark>`);
        charCount += end - item.start;
        i = j;
        lastIndex = end;
        if (ellipsis && charCount > charLimit) break;
      }
      if (lastIndex < str.length) {
        let end = str.length;
        if (ellipsis) end = Math.min(end, lastIndex + offset);
        resultArray.push(replaceHTMLEnt(str.substring(lastIndex, end)));
        if (ellipsis && end !== str.length) {
          resultArray.push(" [...]");
        }
      }
      return resultArray.join("");
    }
    /**
     * 搜索关键词
     */
    async searchKeywords(keywords) {
      const rawData = await this.getData();
      const results = [];
      const validKeywords = keywords.filter((v) => v.trim() !== "").map(escapeRegExp);
      if (validKeywords.length === 0) return [];
      const regex = new RegExp(validKeywords.join("|"), "gi");
      for (const item of rawData) {
        const titleMatches = [];
        const contentMatches = [];
        const titleMatchAll = item.title.matchAll(regex);
        Array.from(titleMatchAll).forEach((match) => {
          if (match.index !== void 0) {
            titleMatches.push({
              start: match.index,
              end: match.index + match[0].length
            });
          }
        });
        const contentMatchAll = item.content.matchAll(regex);
        Array.from(contentMatchAll).forEach((match) => {
          if (match.index !== void 0) {
            contentMatches.push({
              start: match.index,
              end: match.index + match[0].length
            });
          }
        });
        const matchCount = titleMatches.length + contentMatches.length;
        if (matchCount === 0) continue;
        let preview = "";
        if (contentMatches.length > 0) {
          preview = _Search.processMatches(item.content, contentMatches);
        } else {
          preview = replaceHTMLEnt(item.content.substring(0, 140));
        }
        const title = titleMatches.length > 0 ? _Search.processMatches(item.title, titleMatches, false) : item.title;
        results.push({
          ...item,
          title,
          preview,
          matchCount
        });
      }
      return results.sort((a, b) => b.matchCount - a.matchCount);
    }
    /**
     * 执行搜索
     */
    async doSearch(keywords) {
      const startTime = performance.now();
      const results = await this.searchKeywords(keywords);
      this.clear();
      results.forEach((item) => {
        this.list.appendChild(_Search.render(item));
      });
      const endTime = performance.now();
      const time = ((endTime - startTime) / 1e3).toPrecision(1);
      this.resultTitle.textContent = this.generateResultTitle(results.length, time);
    }
    /**
     * 生成结果标题
     */
    generateResultTitle(resultLen, time) {
      return this.resultTitleTemplate.replace("#PAGES_COUNT", resultLen.toString()).replace("#TIME_SECONDS", time);
    }
    /**
     * 获取搜索数据
     */
    async getData() {
      if (!this.data) {
        const jsonURL = this.form.dataset.json;
        if (!jsonURL) throw new Error("\u672A\u8BBE\u7F6E\u641C\u7D22\u6570\u636EJSON URL");
        const response = await fetch(jsonURL);
        if (!response.ok) throw new Error(`\u83B7\u53D6\u6570\u636E\u5931\u8D25: ${response.statusText}`);
        const rawData = await response.json();
        const parser = new DOMParser();
        this.data = rawData.map((item) => ({
          ...item,
          content: parser.parseFromString(item.content, "text/html").body.innerText
        }));
      }
      return this.data;
    }
    /**
     * 绑定搜索表单事件
     */
    bindSearchForm() {
      let lastSearch = "";
      const eventHandler = (e) => {
        e.preventDefault();
        const keywords = this.input.value.trim();
        _Search.updateQueryString(keywords, true);
        if (keywords === "") {
          lastSearch = "";
          return this.clear();
        }
        if (lastSearch === keywords) return;
        lastSearch = keywords;
        this.doSearch(keywords.split(" "));
      };
      this.input.addEventListener("input", eventHandler);
      this.input.addEventListener("compositionend", eventHandler);
      this.form.addEventListener("submit", eventHandler);
    }
    /**
     * 清空搜索结果
     */
    clear() {
      this.list.innerHTML = "";
      this.resultTitle.textContent = "";
    }
    /**
     * 绑定URL参数变化事件
     */
    bindQueryStringChange() {
      window.addEventListener("popstate", () => {
        this.handleQueryString();
      });
    }
    /**
     * 处理URL参数中的搜索关键词
     */
    handleQueryString() {
      const pageURL = new URL(window.location.href);
      const keywords = pageURL.searchParams.get("keyword") || "";
      this.input.value = keywords;
      if (keywords) {
        this.doSearch(keywords.split(" "));
      } else {
        this.clear();
      }
    }
    /**
     * 更新URL查询参数
     */
    static updateQueryString(keywords, replaceState = false) {
      const pageURL = new URL(window.location.href);
      if (keywords === "") {
        pageURL.searchParams.delete("keyword");
      } else {
        pageURL.searchParams.set("keyword", keywords);
      }
      const historyMethod = replaceState ? "replaceState" : "pushState";
      window.history[historyMethod]("", "", pageURL.toString());
    }
    /**
     * 渲染搜索结果项
     */
    static render(item) {
      const article = document.createElement("article");
      const link = document.createElement("a");
      link.href = item.permalink;
      const details = document.createElement("div");
      details.className = "article-details";
      const title = document.createElement("h2");
      title.className = "article-title";
      title.innerHTML = item.title;
      details.appendChild(title);
      const preview = document.createElement("section");
      preview.className = "article-preview";
      preview.innerHTML = item.preview;
      details.appendChild(preview);
      link.appendChild(details);
      if (item.image) {
        const imgContainer = document.createElement("div");
        imgContainer.className = "article-image";
        const img = document.createElement("img");
        img.src = item.image;
        img.loading = "lazy";
        imgContainer.appendChild(img);
        link.appendChild(imgContainer);
      }
      article.appendChild(link);
      return article;
    }
  };
  function searchInit() {
    const searchForm = document.querySelector(".search-form");
    const searchInput = searchForm?.querySelector("input");
    const searchResultList = document.querySelector(".search-result--list");
    const searchResultTitle = document.querySelector(".search-result--title");
    if (searchForm && searchInput && searchResultList && searchResultTitle) {
      new Search({
        form: searchForm,
        input: searchInput,
        list: searchResultList,
        resultTitle: searchResultTitle,
        resultTitleTemplate: window.searchResultTitleTemplate || "\u627E\u5230 #PAGES_COUNT \u4E2A\u7ED3\u679C\uFF08\u8017\u65F6 #TIME_SECONDS \u79D2\uFF09"
      });
    } else {
      console.warn("\u641C\u7D22\u76F8\u5173DOM\u5143\u7D20\u672A\u627E\u5230\uFF0C\u65E0\u6CD5\u521D\u59CB\u5316\u641C\u7D22\u529F\u80FD");
    }
  }
  setTimeout(searchInit, 0);
  var stdin_default = Search;
})();
