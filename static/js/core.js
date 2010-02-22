var KR = window.KR || {};
KR.namespace = function() {
	var b = arguments,
	g = null,
	e, c, f;
	for (e = 0; e < b.length; ++e) {
		f = b[e].split(".");
		g = KR;
		for (c = (f[0] == "KR") ? 1 : 0; c < f.length; ++c) {
			g[f[c]] = g[f[c]] || {};
			g = g[f[c]]
		}
	}
	return g
};
KR.namespace("util", "widget", "app", "con"); (function() {
	var $C = YAHOO.util.Connect,
	$D = YAHOO.util.Dom,
	$E = YAHOO.util.Event,
	$CE = YAHOO.util.CustomEvent,
	$KL = YAHOO.util.KeyListener,
	trim = YAHOO.lang.trim,
	isIE = YAHOO.env.ua.ie;
	var isIE6 = (isIE == 6);
	var isGecko = YAHOO.env.ua.gecko;
	var isWebkit = YAHOO.env.ua.webkit;
	var isOpera = YAHOO.env.ua.opera;
	var isStr = YAHOO.lang.isString;
	KR.con = {
		ASYNC_DATA_ERROR: "网络有问题 请稍后再试试看"
	};
	KR.util = {
		asyncFailure: function(msg) {
			alert(msg || KR.con.ASYNC_DATA_ERROR)
		},
		getRes: function(o, msg) {
			try {
				return eval("(" + o.responseText + ")")
			} catch(ex) {
				return {
					status: 0,
					msg: msg || KR.con.ASYNC_DATA_ERROR
				}
			}
		},
		Effect: {
			_yfade: function(el, sType, arrColorConfig, fCallback) {
				var a = arguments,
				f = "#fff478",
				t = "#ffffff",
				cb;
				if (YAHOO.lang.isArray(a[2])) {
					f = a[2][0] ? a[2][0] : f;
					t = a[2][1] ? a[2][1] : t
				} else {
					if (YAHOO.lang.isFunction(a[2])) {
						cb = a[2]
					}
				}
				if (YAHOO.lang.isFunction(a[3])) {
					cb = a[3]
				}
				var opa = sType == "out" ? {
					from: 1,
					to: 0
				}: {
					from: 0,
					to: 1
				};
				var anim = new YAHOO.util.ColorAnim(el, {
					backgroundColor: {
						from: f,
						to: t
					},
					opacity: opa
				},
				1, YAHOO.util.Easing.easeNone);
				if ("undefined" != typeof cb) {
					anim.onComplete.subscribe(function() {
						cb(el)
					})
				}
				anim.animate();
				return anim
			},
			yellowFadeOut: function(el, arrColorConfig, fCallback) {
				return KR.util.Effect._yfade(el, "out", arrColorConfig, fCallback)
			},
			yellowFadeIn: function(el, arrColorConfig, fCallback) {
				return KR.util.Effect._yfade(el, "in", arrColorConfig, fCallback)
			}
		}
	};
	KR.app.captcha = {
		init: function() {
			var elForm = $D.get("captcha");
			var elImage = $D.get("captcha-image");
			var elShow = $D.get("captcha-show");
			var elSubmit = $D.get("captcha-submit");
			$E.on(elShow, "click",
			function(e) {
				this.style.display = "none";
				var elParent = $D.getAncestorByTagName(elImage, "p");
				if (elParent && elParent.style.display == "none") {
					elParent.style.display = "block"
				}
			});
			$E.on(elSubmit, "click",
			function(e) {
				if ($D.hasClass(elSubmit, "f-disable") || elForm.captcha.value === "") {
					$E.stopEvent(e)
				} else {
					$D.addClass(elSubmit, "f-disable");
					elSubmit.value = "验证中..."
				}
				elSubmit.blur()
			});
			$E.on(elForm, "submit",
			function(e) {
				$E.stopEvent(e);
				$C.setForm(elForm);
				var url = elForm.getAttribute("action");
				$C.asyncRequest("post", url, {
					success: handleResponse,
					failure: KR.util.asyncFailure
				})
			});
			function handleResponse(o) {
				var res = KR.util.getRes(o);
				if (res.status == 1) {
					elForm.parentNode.innerHTML = '<p style="padding:10px;">下载地址(<strong>只在当天内有效</strong>)：<a href="' + res.data + '">' + res.data + "</a><br />部分浏览器(如google的chrome)不支持FTP下载，请使用IE或者Firefox下载。</p>";
					KR.ga.trackEvent("book", "download", "书籍下载")
				} else {
					elImage.src = elImage.src + Math.random();
					alert(res.msg);
					$D.removeClass(elSubmit, "f-disable");
					elSubmit.value = "点击下载";
					elSubmit.blur()
				}
			}
		}
	};
	KR.app.user = (function() {
		var isStarPocesssing = false;
		var emailReg = /^[\w\-\.]+@[\w\-]+(\.\w+)+$/;
		return {
			register: function() {
				var elForm = $D.get("register");
				var elLoading = $D.get("imgLoading");
				var elLoginname = elForm.loginname;
				var elEmail = elForm.email;
				var elLoginpass = elForm.loginpass;
				var elVerifypass = elForm.verifypass;
				var elAnswer = elForm.answer;
				var elSubmit = elForm.submit;
				$E.on(elForm, "submit",
				function(e) {
					$E.stopEvent(e);
					if (elLoginname.value == "") {
						return alert("用户名不能为空")
					}
					if (elEmail.value == "") {
						return alert("Email不能为空")
					} else {
						if (!emailReg.test(elEmail.value)) {
							return alert("Email格式不正确，请检查")
						}
					}
					if (elLoginpass.value == "" || elLoginpass.value.length < 6) {
						return alert("密码不能为空，且长度不能小于6个字符")
					} else {
						if (elLoginpass.value != elVerifypass.value) {
							return alert("两次密码输入不一致")
						}
					}
					if (elAnswer.value == "") {
						return alert("程序执行结果不能为空")
					}
					elSubmit.disabled = true;
					elLoading.style.visibility = "visible";
					$C.setForm(elForm);
					$C.asyncRequest("post", "/register", {
						success: handleResponse,
						failure: KR.util.asyncFailure
					})
				});
				function handleResponse(o) {
					var res = KR.util.getRes(o);
					elSubmit.disabled = false;
					elLoading.style.visibility = "hidden";
					if (res.status) {
						var href = res.data && res.data.redirect ? res.data.redirect: "/";
						window.location.href = href
					} else {
						if (res.data && res.data.isAnswer) {
							alert("程序执行结果不正确，请再接再厉")
						} else {
							alert(res.msg)
						}
					}
				}
			},
			login: function() {},
			logout: function() {},
			favor: function() {
				var elStar = $D.get("book-star");
				var frm = $D.get("captcha");
				$E.on(elStar, "click",
				function(e) {
					if (!isStarPocesssing) {
						if (!frm) {
							showMsg("这本书籍的信息不全，暂时不能收藏。");
							return
						}
						var url = elStar.getAttribute("rel");
						if (!url) {
							showMsg('你需要 <a href="/login">登录</a> 后才能收藏书籍。');
							return
						}
						var skey = frm.skey.value;
						var action = $D.hasClass(elStar, "star") ? "delete": "add";
						var postData = "skey=" + encodeURIComponent(skey) + "&sa=" + action;
						$C.asyncRequest("post", url, {
							success: handleResponse,
							failure: KR.util.asyncFailure
						},
						postData);
						isStarPocesssing = true
					}
				});
				function handleResponse(o) {
					isStarPocesssing = false;
					var res = KR.util.getRes(o);
					if (res.status == 1) {
						if ($D.hasClass(elStar, "star")) {
							$D.removeClass(elStar, "star")
						} else {
							$D.addClass(elStar, "star")
						}
					} else {
						showMsg(res.msg)
					}
				}
				function showMsg(str) {
					var elMsg = $D.get("book-star-msg");
					elMsg.innerHTML = str;
					elMsg.style.display = "";
					KR.util.Effect.yellowFadeIn(elMsg)
				}
			}
		}
	})();
	KR.app.showContent = {
		init: function() {
			var el = $D.get("tableofcontent-t");
			var elContent = $D.get("tableofcontent");
			if (elContent) {
				elContent.style.display = "none"
			}
			$E.on(el, "click",
			function(e) {
				el.blur();
				if (elContent.style.display == "none") {
					elContent.style.display = "";
					el.innerHTML = "- 收缩目录"
				} else {
					elContent.style.display = "none";
					el.innerHTML = "+ 展开目录"
				}
			})
		}
	};
	KR.app.upload = {
		init: function() {
			YAHOO.widget.Uploader.SWFURL = "/static/images/uploader.swf";
			var sUrl = "/upload";
			var sImageUrl = "/static/images/flash-upload-bg.png";
			var fileList = {};
			var MAXSIZE_BOOK = 50 * 1024 * 1024;
			var MAXSIZE_IMAGE = 2 * 1024 * 1024;
			var elSelect = $D.get("uploadselect");
			var elList = $D.get("uploadlist");
			var elSkey = $D.get("skey");
			var elXkey = $D.get("xkey");
			var uploader = new YAHOO.widget.Uploader(elSelect, sImageUrl);
			var fileFilter = [{
				description: "zip压缩包(*.zip)",
				extensions: "*.zip"
			}];
			var errorFiles = [];
			uploader.addListener("contentReady", handleContentReady);
			uploader.addListener("fileSelect", onFileSelect);
			uploader.addListener("uploadStart", onUploadStart);
			uploader.addListener("uploadProgress", onUploadProgress);
			uploader.addListener("uploadCancel", onUploadCancel);
			uploader.addListener("uploadComplete", onUploadComplete);
			uploader.addListener("uploadCompleteData", onUploadResponse);
			uploader.addListener("uploadError", onUploadError);
			uploader.addListener("click", handleClick);
			function handleClick() {}
			function handleContentReady() {
				uploader.setAllowMultipleFiles(false);
				uploader.setSimUploadLimit(1)
			}
			function upload() {
				var skey = elSkey ? elSkey.value: "";
				var xkey = elXkey ? elXkey.value: "";
				uploader.uploadAll(sUrl, "POST", {
					cookie: document.cookie,
					skey: skey,
					xkey: xkey
				},
				"book")
			}
			function onFileSelect(event) {
				fileList = event.fileList;
				elList.innerHTML = buildHTML(fileList);
				elList.style.display = "";
				if ($D.getElementsByClassName("error", "td", elList).length) {
					for (var i in errorFiles) {
						uploader.removeFile(errorFiles[i].id)
					}
				} else {
					upload()
				}
			}
			function check(file) {
				var name = file.name;
				var size = file.size;
				if (/\.chm$|\.pdf$/.test(name)) {
					return size < MAXSIZE_BOOK
				} else {
					if (/\.jpg$|\.gif$|\.png$/.test(name)) {
						return size < MAXSIZE_IMAGE
					} else {
						return false
					}
				}
			}
			function buildHTML(files) {
				var html = [];
				html.push('<table class="upload">');
				html.push('<tr><td class="name">文件名</td><td class="size">大小</td><td class="progress">进度</td></tr>');
				for (var i in files) {
					var file = files[i];
					if (check(file)) {
						html.push('<tr><td class="name">' + file.name + '</td><td class="size">' + getSizeText(file.size) + '</td><td class="progress" id="progress-' + file.id + '">0%</td></tr>')
					} else {
						errorFiles.push(file);
						html.push('<tr><td class="name error">' + file.name + ' [ 文件格式错误或者文件过大 ]</td><td class="size error">' + getSizeText(file.size) + '</td><td class="progress error" id="progress-' + file.id + '">发生错误</td></tr>')
					}
				}
				html.push("</table>");
				return html.join("")
			}
			function getSizeText(size) {
				var n;
				if (size > 1024 * 1024) {
					n = Math.round(parseFloat(size / (1024 * 1024)) * 100);
					return n / 100 + "m"
				} else {
					if (size > 1024) {
						n = Math.round(parseFloat(size / 1024) * 100);
						return n / 100 + "k"
					} else {
						if (size === 0) {
							return "0"
						} else {
							return size + "b"
						}
					}
				}
			}
			function onUploadStart(event) {
				var fileId = event.id;
				var file;
				window.setTimeout(function() {},
				timeout * 1000)
			}
			function onUploadProgress(event) {
				var rate = Math.floor((event.bytesLoaded * 100) / event.bytesTotal);
				rate = rate == 100 ? 99 : rate;
				$D.get("progress-" + event.id).innerHTML = rate + "%"
			}
			function onUploadComplete(event) {}
			function onUploadError(event) {
				alert(event.status);
				$D.get("progress-" + event.id).innerHTML = "网络错误"
			}
			function onUploadCancel(event) {}
			function onUploadResponse(event) {
				var id = event.id;
				var res;
				try {
					res = eval("(" + event.data + ")")
				} catch(e) {
					res = {
						status: 0,
						msg: "网络问题"
					}
				}
				if (res.status == 1 && res.data) {
					var type = res.data.type;
					var path, url;
					var el = $D.get("progress-" + id);
					if (type == "book") {
						path = res.data.path;
						url = res.data.url;
						$D.get("download").value = path;
						$D.get("rc_%e4%b8%8b%e8%bd%bd%e5%9c%b0%e5%9d%80").value = path
					} else {
						if (type == "image") {
							var thumbnail = res.data.thumbnail;
							var cover = res.data.cover;
							var elImage = $D.get("preImage");
							$D.get("thumbnail").value = thumbnail.path;
							$D.get("rc_%e7%bc%a9%e7%95%a5%e5%9b%be").value = thumbnail.path;
							elImage.src = thumbnail.url + "?v=" + Math.random();
							if (cover) {
								$D.get("cover").value = cover.path;
								$D.get("rc_%e5%b0%81%e9%9d%a2%e5%a4%a7%e5%9b%be").value = cover.path
							}
						}
					}
					el.innerHTML = "成功上传";
					$D.addClass(el, "success")
				} else {
					alert(res.msg)
				}
			}
		}
	};
	KR.app.editor = function() {
		var config = {
			height: "150px",
			width: "508px",
			dompath: false,
			focusAtStart: true,
			animate: true,
			toolbar: {
				buttons: [{
					group: "textstyle",
					buttons: [{
						type: "push",
						label: "Bold",
						value: "bold"
					},
					{
						type: "push",
						label: "Italic",
						value: "italic"
					},
					{
						type: "push",
						label: "Underline",
						value: "underline"
					}]
				}]
			}
		};
		var editer_c = new YAHOO.widget.SimpleEditor("post-content", config);
		var editer_t = new YAHOO.widget.SimpleEditor("rc_%e7%9b%ae%e5%bd%95", config);
		editer_c.render();
		editer_t.render();
		$E.on("post-add", "submit",
		function(e) {
			editer_c.saveHTML();
			editer_t.saveHTML()
		})
	};
	KR.app.preview = {
		init: function() {
			var keyLeftArrow = new $KL(document, {
				keys: 37
			},
			function(type, args) {
				prev(args[1])
			});
			var keyUpArrow = new $KL(document, {
				keys: 38
			},
			function(type, args) {
				prev(args[1])
			});
			var keyRightArrow = new $KL(document, {
				keys: 39
			},
			function(type, args) {
				next(args[1])
			});
			var keyDownArrow = new $KL(document, {
				keys: 40
			},
			function(type, args) {
				next(args[1])
			});
			var keyHome = new $KL(document, {
				keys: 36
			},
			function(type, args) {
				first(args[1])
			});
			var keyEnd = new $KL(document, {
				keys: 35
			},
			function(type, args) {
				last(args[1])
			});
			var keyH = new $KL(document, {
				keys: 72
			},
			function(type, args) {
				prev(args[1])
			});
			var keyJ = new $KL(document, {
				keys: 74
			},
			function(type, args) {
				scroll(args[1], true)
			});
			var keyK = new $KL(document, {
				keys: 75
			},
			function(type, args) {
				scroll(args[1], false)
			});
			var keyL = new $KL(document, {
				keys: 76
			},
			function(type, args) {
				next(args[1])
			});
			var keyEnter = new $KL(document, {
				keys: 13
			},
			function(type, args) {
				enter(args[1])
			});
			var elForm = $D.get("pdfpreview-form");
			keyLeftArrow.enable();
			keyRightArrow.enable();
			keyHome.enable();
			keyEnd.enable();
			keyH.enable();
			keyJ.enable();
			keyK.enable();
			keyL.enable();
			keyEnter.enable();
			function prev(e) {
				redirect(e, "linkpre")
			}
			function next(e) {
				redirect(e, "linknext")
			}
			function first(e) {
				redirect(e, "linkfirst")
			}
			function last(e) {
				redirect(e, "linklast")
			}
			function redirect(e, el) {
				if (e) {
					$E.stopEvent(e)
				}
				el = $D.get(el);
				if (el) {
					window.location.href = el.href
				}
			}
			function scroll(e, down) {
				if (e) {
					$E.stopEvent(e)
				}
				var top = $D.getDocumentScrollTop();
				var height = $D.getDocumentHeight();
				var step = 50;
				var y = down ? top + step: top - step;
				if (y > height) {
					y = height
				} else {
					if (y < 0) {
						y = 0
					}
				}
				window.scrollTo(0, y)
			}
			function enter(e) {
				var height = $D.getDocumentHeight();
				elForm.page.focus();
				window.scrollTo(0, height);
				submit(e)
			}
			function submit(e) {
				if (e) {
					$E.stopEvent(e)
				}
				var page = elForm.page.value;
				if (page && /^\d+$/.test(page)) {
					elForm.submit()
				} else {}
			}
			$E.on(elForm, "submit",
			function(e) {
				submit(e)
			})
		}
	};
	KR.app.forum = (function() {
		function digg(e) {
			var target = $E.getTarget(e);
			var nodeName = target.nodeName.toLowerCase();
			if (nodeName != "img" || !$D.hasClass(target, "digg")) {
				return
			}
			if ($D.hasClass(target, "digged")) {
				return
			}
			$E.stopEvent(e);
			var id = target.getAttribute("sid");
			var increment = target.getAttribute("bvalue");
			var elEdit = $D.get("forum-edit-" + id);
			var elUp = $D.get("diggup-" + id);
			var elSpan = $D.get("diggcount-" + id);
			var elDown = $D.get("diggdown-" + id);
			var elParent = $D.getAncestorByClassName(target, "forum-block");
			var postData = "thread_id=" + id + "&increment=" + increment;
			$C.asyncRequest("POST", "/forum/digg", {
				success: function(o) {
					var res = KR.util.getRes(o);
					if (res.status) {
						KR.util.Effect.yellowFadeIn(elParent);
						elSpan.innerHTML = res.data.diggs;
						if (target == elUp) {
							$D.addClass(elUp, "digged");
							$D.removeClass(elDown, "digged")
						} else {
							$D.addClass(elDown, "digged");
							$D.removeClass(elUp, "digged")
						}
					} else {
						alert(res.msg)
					}
				},
				failure: KR.util.asyncFailure
			},
			postData)
		}
		return {
			index: function() {
				var elForum = $D.get("forum");
				$E.on(elForum, "click", digg);
				$D.getElementsByClassName("add", "a", elForum, add);
				function add(el) {
					var elForm = $D.get("forum-add-form");
					var elSubject = elForm.subject;
					var height = $D.getDocumentHeight();
					$E.on(el, "click",
					function(e) {
						$E.stopEvent(e);
						elSubject.focus();
						window.scrollTo(0, height)
					})
				}
			},
			thread: function() {
				var elForum = $D.get("forum");
				var elTagslist = $D.get("taglist");
				var elTagSelected = $D.get("tag-selected");
				var elTagSearch = $D.get("tag-search");
				var fireEvent = isOpera ? "input": "keyup";
				var tagMax = 5;
				var showMax = 10;
				var tagCache = [];
				var tagDefaults = [];
				var tagtip = "在这里输入标签名称查找...";
				$D.getElementsByClassName("reply", "a", elForum, reply);
				$D.getElementsByClassName("edit", "a", elForum, edit);
				$D.getElementsByClassName("delete", "a", elForum, remove);
				$E.on(elForum, "click", digg);
				$E.on(elTagslist, "click", selectTag);
				$E.on(elTagSelected, "click", removeTag);
				$E.on(elTagSearch, fireEvent, searchTag);
				$E.on(elTagSearch, "focus",
				function(e) {
					if (this.value == tagtip) {
						this.value = "";
						$D.removeClass(this, "noinput")
					}
				});
				$E.on(elTagSearch, "blur",
				function(e) {
					if (this.value == "") {
						this.value = tagtip;
						$D.addClass(this, "noinput")
					}
				});
				function analyze(list) {
					var ret = [];
					for (var i = 0,
					len = list.length; i < len; i++) {
						var arr = list[i].split("|");
						if (arr.length < 2) {
							continue
						} else {
							ret.push({
								id: arr[0],
								name: arr[1]
							})
						}
					}
					return ret
				}
				function init() {
					var elFormCache = $D.get("forum-form-cache");
					var all = elFormCache.all.value.split(",");
					var defaults = elFormCache.defaults.value.split(",");
					tagCache = analyze(all);
					tagDefaults = analyze(defaults);
					elTagslist.innerHTML = buildTags(tagDefaults);
					elTagSearch.value = tagtip;
					$D.addClass(elTagSearch, "noinput")
				}
				init();
				function reply(el) {
					var elForm = $D.get("forum-reply-form");
					var elTextarea = elForm.text;
					var height = $D.getDocumentHeight();
					$E.on(el, "click",
					function(e) {
						$E.stopEvent(e);
						elTextarea.focus();
						window.scrollTo(0, height)
					})
				}
				function edit(el) {
					var id = el.getAttribute("sid");
					var elEdit = $D.get("forum-edit-" + id);
					var elText = $D.get("forum-text-" + id);
					var elSubject = $D.get("thread-subject-" + id);
					var elParent = $D.getAncestorByClassName(elEdit, "forum-block");
					var elForm = elEdit.getElementsByTagName("form")[0];
					var elSubjectInput = elForm.subject;
					var elTextarea = elForm.text;
					var elTags = elForm.threadtags;
					var elCancel = elForm.edit_cancel;
					$E.on(el, "click",
					function(e) {
						$E.stopEvent(e);
						elEdit.style.display = "";
						elText.style.display = "none";
						elTextarea.value = trim(elText.getAttribute("stext"));
						elTextarea.focus()
					});
					$E.on(elCancel, "click",
					function(e) {
						elEdit.style.display = "none";
						elText.style.display = ""
					});
					$E.on(elForm, "submit",
					function(e) {
						$E.stopEvent(e);
						if (elTags) {
							var tags = getTags();
							elTags.value = tags.join(",")
						}
						$C.setForm(this);
						$C.asyncRequest("POST", this.action, {
							success: function(o) {
								var res = KR.util.getRes(o);
								if (res.status) {
									if (res.data && res.data.redirect) {
										window.location.href = res.data.redirect
									} else {
										elText.setAttribute("stext", elTextarea.value);
										elText.innerHTML = res.data.text;
										if (elSubject && elSubjectInput) {
											elSubject.innerHTML = elSubjectInput.value
										}
										elEdit.style.display = "none";
										elText.style.display = "";
										KR.util.Effect.yellowFadeIn(elParent)
									}
								} else {
									alert(res.msg)
								}
							},
							failure: KR.util.asyncFailure
						})
					})
				}
				function remove(el) {
					var id = el.getAttribute("sid");
					var elEdit = $D.get("forum-edit-" + id);
					var elText = $D.get("forum-text-" + id);
					var elParent = $D.getAncestorByClassName(elEdit, "forum-block");
					var elForm = elEdit.getElementsByTagName("form")[0];
					$E.on(el, "click",
					function(e) {
						$E.stopEvent(e);
						if (!confirm("确定要删除这个帖子么？")) {
							return
						}
						var postData = "thread_id=" + id;
						$C.asyncRequest("POST", "/forum/delete", {
							success: function(o) {
								var res = KR.util.getRes(o);
								if (res.status) {
									if (res.data && res.data.redirect) {
										window.location.href = res.data.redirect
									} else {
										KR.util.Effect.yellowFadeOut(elParent, null,
										function() {
											elParent.parentNode.removeChild(elParent)
										})
									}
								} else {
									alert(res.msg)
								}
							},
							failure: KR.util.asyncFailure
						},
						postData)
					})
				}
				function selectTag(e) {
					var target = $E.getTarget(e);
					var nodeName = target.nodeName.toLowerCase();
					if (nodeName != "a" || !$D.hasClass(target, "tag")) {
						return
					}
					$E.stopEvent(e);
					target.blur();
					var tag = target.innerHTML;
					var id = target.getAttribute("sid");
					if (elTagSelected.getElementsByTagName("a").length >= tagMax) {
						return
					}
					var a = document.createElement("a");
					a.href = "#";
					a.className = "tag";
					a.setAttribute("sid", id);
					a.innerHTML = tag;
					elTagSelected.appendChild(a)
				}
				function removeTag(e) {
					var target = $E.getTarget(e);
					var nodeName = target.nodeName.toLowerCase();
					if (nodeName != "a" || !$D.hasClass(target, "tag")) {
						return
					}
					$E.stopEvent(e);
					target.blur();
					target.parentNode.removeChild(target)
				}
				function getTags() {
					var els = elTagSelected.getElementsByTagName("a");
					var tags = [];
					for (var i = 0; i < els.length; i++) {
						tags.push(els[i].getAttribute("sid"))
					}
					return tags
				}
				function hastag(tags, tag) {
					for (var i = 0; i < tags.length; i++) {
						if (tags[i] == tag) {
							return true
						}
					}
					return false
				}
				function cleantag(tags) {
					var ret = [];
					for (var i = 0; i < tags.length; i++) {
						if (tags[i] != "") {
							ret.push(tags[i])
						}
					}
					return ret
				}
				function searchTag(e) {
					if (e) {
						$E.stopEvent(e)
					}
					var tag = trim(this.value);
					var list = search(tag);
					elTagslist.innerHTML = buildTags(list)
				}
				function buildTags(tags) {
					var html = [];
					for (var i = 0,
					len = tags.length; i < len; i++) {
						var tag = tags[i];
						html.push('<a class="tag" href="#" sid="' + tag.id + '">' + tag.name + "</a>")
					}
					return html.join("")
				}
				function search(str) {
					var ret = [];
					if (!str) {
						return tagDefaults
					}
					function sort(a, b) {
						var len = str.length;
						if (a.name.substr(0, len).toLowerCase() == str) {
							return - 1
						} else {
							if (b.name.substr(0, len).toLowerCase() == str) {
								return 1
							} else {
								return a.name.localeCompare(b.name)
							}
						}
					}
					for (var i = 0,
					len = tagCache.length; i < len; i++) {
						var name = tagCache[i].name.toLowerCase();
						if (name.indexOf(str) != -1) {
							ret.push(tagCache[i])
						}
					}
					ret.sort(sort);
					if (ret.length > showMax) {
						ret = ret.slice(0, showMax)
					}
					return ret
				}
			}
		}
	})();
	KR.ga = {
		tracker: null,
		trackEvent: function(category, action, label, value) {
			if (this.tracker) {
				this.tracker._trackEvent(category, action, label, value)
			}
		},
		init: function() {
			var max = 0;
			var timer = window.setInterval(function() {
				if (max > 599) {
					window.clearInterval(timer)
				}
				if (window.pageTracker) {
					KR.ga.tracker = window.pageTracker;
					window.clearInterval(timer)
				}
				max++
			},
			200)
		}
	};
	YAHOO.util.Event.onDOMReady(function() {
		KR.ga.init()
	})
})();
