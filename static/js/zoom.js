KR.app.Zoom = (function() {
	var ag = YAHOO.util.Connect;
	var ae = YAHOO.util.Dom;
	var ad = YAHOO.util.Event;
	var o = YAHOO.util.KeyListener;
	var aq = YAHOO.env.ua.ie;
	var z = (aq == 6);
	var C = YAHOO.env.ua.gecko;
	var P = YAHOO.env.ua.webkit;
	var g = YAHOO.env.ua.opera;
	var i = YAHOO.lang.isString;
	var t = true;
	var L = 5;
	var U = 15;
	var c = 1;
	var ab = 90;
	var W = "0px 5px 25px rgba(0, 0, 0, ";
	var ar = "/books/static/images/zoom/";
	var m = 0,
	I = 0,
	at = 0,
	ac = 0,
	s = 0;
	var D = false,
	E = 1,
	O = false,
	x = 0,
	l = new Image();
	var X = 0;
	var B = [],
	Y = [],
	ak = [],
	an = [],
	aj = [],
	ai = [];
	var R = [],
	d = [],
	H = [],
	J = [],
	N = [];
	var aa, au;
	var v = "ZoomBox";
	var F = "ZoomImage";
	var a = "ZoomCaption";
	var al = "ZoomCapDiv";
	function M() {
		var av = ae.get("zoom-mask");
		if (!av) {
			return
		}
		av.style.height = ae.getDocumentHeight() + "px";
		av.style.width = ae.getDocumentWidth() + "px";
		av.style.left = 0;
		av.style.top = 0;
		av.style.display = "";
		ae.setStyle(av, "opacity", 0.5)
	}
	function f() {
		var av = ae.get("zoom-mask");
		if (!av) {
			return
		}
		av.style.height = ae.getDocumentHeight() + "px";
		av.style.width = ae.getDocumentWidth() + "px";
		av.style.left = 0;
		av.style.top = 0;
		av.style.display = "none";
		if (aq) {} else {}
	}
	function p(aw) {
		var av = aw.getAttribute("href");
		if (l.src.indexOf(aw.getAttribute("href").substr(aw.getAttribute("href").lastIndexOf("/"))) == -1) {
			O = true;
			l = new Image();
			l.onload = function() {
				O = false
			};
			l.src = av
		}
	}
	function u(av) {
		if (O != false) {
			document.getElementById("SpinImage").src = ar + "zoom-spin-" + E + ".png";
			E++;
			if (E > 12) {
				E = 1
			}
		} else {
			document.getElementById("ZoomSpin").style.visibility = "hidden";
			clearInterval(X);
			X = 0;
			h(preloadFrom)
		}
	}
	function y() {
		x = new Date();
		document.getElementById("ZoomSpin").style.left = (m / 2) + "px";
		document.getElementById("ZoomSpin").style.top = ((I / 2) + at) + "px";
		document.getElementById("ZoomSpin").style.visibility = "visible";
		E = 1;
		document.getElementById("SpinImage").src = ar + "zoom-spin-" + E + ".png";
		X = setInterval(u, 100)
	}
	function G(ax, aw) {
		var av = ah(aw);
		if (!aw && window.event && (window.event.metaKey || window.event.altKey)) {
			return true
		} else {
			if (aw && (aw.metaKey || aw.altKey)) {
				return true
			}
		}
		e();
		if (O == true) {
			if (X == 0) {
				preloadFrom = ax;
				y()
			}
		} else {
			h(ax, av)
		}
		return false
	}
	function h(ax, av) {
		au.src = ax.getAttribute("href");
		if (ax.childNodes[0].width) {
			startW = ax.childNodes[0].width;
			startH = ax.childNodes[0].height;
			startPos = ao(ax.childNodes[0])
		} else {
			startW = 50;
			startH = 12;
			startPos = ao(ax)
		}
		hostX = startPos[0];
		hostY = startPos[1];
		if (document.getElementById("scroller")) {
			hostX = hostX - document.getElementById("scroller").scrollLeft
		}
		endW = l.width;
		endH = l.height;
		if (B[F] != true) {
			if (document.getElementById("ShadowBox")) {
				document.getElementById("ShadowBox").style.visibility = "hidden"
			} else {
				if (!aq) {
					if (R[F]) {
						clearInterval(H[F]);
						R[F] = false;
						H[F] = false
					}
				}
			}
			document.getElementById("ZoomClose").style.visibility = "hidden";
			if (t) {
				document.getElementById(al).style.visibility = "hidden";
				if (ax.getAttribute("title") && t) {
					var aw = ax.getAttribute("title");
					if (aw.length > 30) {
						aw = aw.substr(0, 30) + "..."
					}
					document.getElementById(a).innerHTML = aw
				} else {
					document.getElementById(a).innerHTML = ""
				}
			}
			ak[F] = startW;
			an[F] = startH;
			aj[F] = hostX;
			ai[F] = hostY;
			au.style.width = startW + "px";
			au.style.height = startH + "px";
			aa.style.left = hostX + "px";
			aa.style.top = hostY + "px";
			if (c == 1) {
				k(0, v)
			}
			aa.style.visibility = "visible";
			sizeRatio = endW / endH;
			if (endW > m - ab) {
				endW = m - ab;
				endH = endW / sizeRatio
			}
			if (endH > I - ab) {
				endH = I - ab;
				endW = endH * sizeRatio
			}
			zoomChangeX = ((m / 2) - (endW / 2) - hostX);
			zoomChangeY = (((I / 2) - (endH / 2) - hostY) + at);
			zoomChangeW = (endW - startW);
			zoomChangeH = (endH - startH);
			if (av) {
				tempSteps = U * 7
			} else {
				tempSteps = U
			}
			zoomCurrent = 0;
			if (c == 1) {
				fadeCurrent = 0;
				fadeAmount = (0 - 100) / tempSteps
			} else {
				fadeAmount = 0
			}
			Y[F] = setInterval(function() {
				K(v, F, zoomCurrent, startW, zoomChangeW, startH, zoomChangeH, hostX, zoomChangeX, hostY, zoomChangeY, tempSteps, c, fadeAmount,
				function() {
					am(v)
				})
			},
			L);
			B[F] = true
		}
	}
	function A(aw, av) {
		f();
		if (ah(av)) {
			tempSteps = U * 7
		} else {
			tempSteps = U
		}
		if (B[F] != true) {
			if (document.getElementById("ShadowBox")) {
				document.getElementById("ShadowBox").style.visibility = "hidden"
			} else {
				if (!aq) {
					if (R[F]) {
						clearInterval(H[F]);
						R[F] = false;
						H[F] = false
					}
				}
			}
			document.getElementById("ZoomClose").style.visibility = "hidden";
			if (t && document.getElementById(a).innerHTML != "") {
				document.getElementById(al).style.visibility = "hidden"
			}
			startX = parseInt(aa.style.left, 10);
			startY = parseInt(aa.style.top, 10);
			startW = au.width;
			startH = au.height;
			zoomChangeX = aj[F] - startX;
			zoomChangeY = ai[F] - startY;
			zoomChangeW = ak[F] - startW;
			zoomChangeH = an[F] - startH;
			zoomCurrent = 0;
			if (c == 1) {
				fadeCurrent = 0;
				fadeAmount = (100 - 0) / tempSteps
			} else {
				fadeAmount = 0
			}
			Y[F] = setInterval(function() {
				K(v, F, zoomCurrent, startW, zoomChangeW, startH, zoomChangeH, startX, zoomChangeX, startY, zoomChangeY, tempSteps, c, fadeAmount,
				function() {
					af(v, F)
				})
			},
			L);
			B[F] = true
		}
	}
	function am(av, aw) {
		D = true;
		av = document.getElementById(av);
		if (document.getElementById("ShadowBox")) {
			k(0, "ShadowBox");
			shadowdiv = document.getElementById("ShadowBox");
			shadowLeft = parseInt(av.style.left, 10) - 13;
			shadowTop = parseInt(av.style.top, 10) - 8;
			shadowWidth = av.offsetWidth + 26;
			shadowHeight = av.offsetHeight + 26;
			shadowdiv.style.width = shadowWidth + "px";
			shadowdiv.style.height = shadowHeight + "px";
			shadowdiv.style.left = shadowLeft + "px";
			shadowdiv.style.top = shadowTop + "px";
			document.getElementById("ShadowBox").style.visibility = "visible"
		} else {
			if (!aq) {
				T("ZoomImage", 0, 0.8, 5, 0, "shadow")
			}
		}
		if (t && document.getElementById(a).innerHTML != "") {
			zoomcapd = document.getElementById(al);
			zoomcapd.style.top = parseInt(av.style.top, 10) + (av.offsetHeight + 15) + "px";
			zoomcapd.style.left = (m / 2) - (zoomcapd.offsetWidth / 2) + "px";
			zoomcapd.style.visibility = "visible"
		}
		if (!aq) {
			k(0, "ZoomClose")
		}
		document.getElementById("ZoomClose").style.visibility = "visible";
		if (!aq) {
			T("ZoomClose", 0, 100, 5)
		}
		document.onkeypress = V
	}
	function af(av, aw) {
		D = false;
		an[aw] = "";
		ak[aw] = "";
		document.getElementById(av).style.visibility = "hidden";
		B[aw] == false;
		document.onkeypress = null
	}
	function K(av, az, aA, aJ, aD, aE, ay, aI, aC, aG, aB, aH, ax, aw, aF) {
		if (aA == (aH + 1)) {
			B[az] = false;
			clearInterval(Y[az]);
			aF && aF()
		} else {
			if (ax == 1) {
				if (aw < 0) {
					k(Math.abs(aA * aw), av)
				} else {
					k(100 - (aA * aw), av)
				}
			}
			moveW = Z(aA, aJ, aD, aH);
			moveH = Z(aA, aE, ay, aH);
			moveX = Z(aA, aI, aC, aH);
			moveY = Z(aA, aG, aB, aH);
			document.getElementById(av).style.left = moveX + "px";
			document.getElementById(av).style.top = moveY + "px";
			au.style.width = moveW + "px";
			au.style.height = moveH + "px";
			aA++;
			clearInterval(Y[az]);
			Y[az] = setInterval(function() {
				K(av, az, aA, aJ, aD, aE, ay, aI, aC, aG, aB, aH, ax, aw, aF)
			},
			L)
		}
	}
	function V(av) {
		if (!av) {
			theKey = event.keyCode
		} else {
			theKey = av.keyCode
		}
		if (theKey == 27) {
			A(this, av)
		}
	}
	function S(av) {
		if (av.id) {
			T(av.id, 100, 0, 10)
		}
	}
	function Q(av) {
		if (av.id) {
			T(av.id, 0, 100, 10)
		}
	}
	function T(ay, aA, ax, aw, az, av) {
		if (R[ay] == true) {
			d[ay] = new Array(ay, aA, ax, aw)
		} else {
			fadeSteps = aw;
			fadeCurrent = 0;
			fadeAmount = (aA - ax) / fadeSteps;
			H[ay] = setInterval(function() {
				q(ay, fadeCurrent, fadeAmount, fadeSteps)
			},
			15);
			R[ay] = true;
			N[ay] = av;
			if (az == 1) {
				J[ay] = true
			} else {
				J[ay] = false
			}
		}
	}
	function q(aw, ay, av, ax) {
		if (ay == ax) {
			clearInterval(H[aw]);
			R[aw] = false;
			H[aw] = false;
			if (J[aw] == true) {
				document.getElementById(aw).style.visibility = "hidden"
			}
			if (d[aw] && d[aw] != false) {
				T(d[aw][0], d[aw][1], d[aw][2], d[aw][3]);
				d[aw] = false
			}
		} else {
			ay++;
			if (N[aw] != "shadow") {
				if (av < 0) {
					k(Math.abs(ay * av), aw)
				} else {
					k(100 - (ay * av), aw)
				}
			}
			clearInterval(H[aw]);
			H[aw] = setInterval(function() {
				q(aw, ay, av, ax)
			},
			15)
		}
	}
	function k(aw, av) {
		ae.setStyle(av, "opacity", aw);
		if (aw == 100 && aq) {
			ae.get(av).style.filter = ""
		}
	}
	function w(aw, av, ay, ax) {
		return ay * aw / ax + av
	}
	function b(aw, av, ay, ax) {
		return - ay / 2 * (Math.cos(Math.PI * aw / ax) - 1) + av
	}
	function r(aw, av, ay, ax) {
		return ay * (aw /= ax) * aw * aw + av
	}
	function n(aw, av, ay, ax) {
		return ay * ((aw = aw / ax - 1) * aw * aw + 1) + av
	}
	function Z(aw, av, ay, ax) {
		if ((aw /= ax / 2) < 1) {
			return ay / 2 * aw * aw * aw + av
		}
		return ay / 2 * ((aw -= 2) * aw * aw + 2) + av
	}
	function ap(aw, av, ay, ax) {
		if ((aw /= ax) < (1 / 2.75)) {
			return ay * (7.5625 * aw * aw) + av
		} else {
			if (aw < (2 / 2.75)) {
				return ay * (7.5625 * (aw -= (1.5 / 2.75)) * aw + 0.75) + av
			} else {
				if (aw < (2.5 / 2.75)) {
					return ay * (7.5625 * (aw -= (2.25 / 2.75)) * aw + 0.9375) + av
				} else {
					return ay * (7.5625 * (aw -= (2.625 / 2.75)) * aw + 0.984375) + av
				}
			}
		}
	}
	function e() {
		if (self.innerHeight) {
			m = window.innerWidth;
			I = window.innerHeight;
			at = window.pageYOffset
		} else {
			if (document.documentElement && document.documentElement.clientHeight) {
				m = document.documentElement.clientWidth;
				I = document.documentElement.clientHeight;
				at = document.documentElement.scrollTop
			} else {
				if (document.body) {
					m = document.body.clientWidth;
					I = document.body.clientHeight;
					at = document.body.scrollTop
				}
			}
		}
		if (window.innerHeight && window.scrollMaxY) {
			ac = document.body.scrollWidth;
			s = window.innerHeight + window.scrollMaxY
		} else {
			if (document.body.scrollHeight > document.body.offsetHeight) {
				ac = document.body.scrollWidth;
				s = document.body.scrollHeight
			} else {
				ac = document.body.offsetWidth;
				s = document.body.offsetHeight
			}
		}
	}
	function ah(aw) {
		var av = false;
		if (!aw && window.event) {
			av = window.event.shiftKey
		} else {
			if (aw) {
				av = aw.shiftKey;
				if (av) {
					aw.stopPropagation()
				}
			}
		}
		return av
	}
	function ao(av) {
		var ax = 0;
		var aw = 0;
		do {
			ax += av.offsetLeft;
			aw += av.offsetTop
			av = av.offsetParent;
		} while (av);
		return Array(ax, aw)
	}
	function j() {
		var ax = document.getElementsByTagName("body").item(0);
		var aB = document.createElement("div");
		aB.setAttribute("id", "ZoomSpin");
		aB.style.position = "absolute";
		aB.style.left = "10px";
		aB.style.top = "10px";
		aB.style.visibility = "hidden";
		aB.style.zIndex = "525";
		ax.insertBefore(aB, ax.firstChild);
		var av = document.createElement("img");
		av.setAttribute("id", "SpinImage");
		av.setAttribute("src", ar + "zoom-spin-1.png");
		aB.appendChild(av);
		var aD = document.createElement("div");
		aD.setAttribute("id", "ZoomBox");
		aD.style.position = "absolute";
		aD.style.left = "10px";
		aD.style.top = "10px";
		aD.style.visibility = "hidden";
		aD.style.zIndex = "499";
		ax.insertBefore(aD, aB.nextSibling);
		var aw = document.createElement("img");
		aw.onclick = function(aE) {
			A(this, aE);
			return false
		};
		aw.setAttribute("src", ar + "spacer.gif");
		aw.setAttribute("id", "ZoomImage");
		aw.setAttribute("border", "0");
		aw.style.display = "block";
		aw.style.width = "10px";
		aw.style.height = "10px";
		aw.style.cursor = "pointer";
		aD.appendChild(aw);
		var ay = document.createElement("div");
		ay.setAttribute("id", "ZoomClose");
		ay.style.position = "absolute";
		ay.style.left = "-15px";
		ay.style.top = "-15px";
		ay.style.visibility = "hidden";
		aD.appendChild(ay);
		var aA = document.createElement("div");
		aA.className = "close";
		aA.onclick = function(aE) {
			A(this, aE);
			return false
		};
		ay.appendChild(aA);
		if (t) {
			var aC = document.createElement("div");
			var az = '<table border="0" cellpadding="0" cellspacing="0"><tr height="26"><td class="left"></td><td class="center"><div id="ZoomCaption"></div></td><td class="right"></td></tr></table>';
			aC.setAttribute("id", "ZoomCapDiv");
			aC.style.position = "absolute";
			aC.style.visibility = "hidden";
			aC.style.marginLeft = "auto";
			aC.style.marginRight = "auto";
			aC.style.zIndex = "501";
			aC.innerHTML = az;
			ax.insertBefore(aC, aD.nextSibling)
		}
	}
	return {
		init: function(av) {
			if (i(av)) {
				av = ae.get(av)
			}
			ae.getElementsByClassName("zoom", "a", av,
			function(ax) {
				var aw = ax.getAttribute("href");
				if (aw && aw.search(/\.(jpg|jpeg|gif|png|bmp|tif|tiff)$/gi) != -1) {
					ad.on(ax, "click",
					function(ay) {
						ad.stopEvent(ay);
						M();
						return G(this, ay)
					});
					ad.on(ax, "mouseover",
					function(ay) {
						p(this)
					})
				}
			});
			j();
			aa = ae.get(v);
			au = ae.get(F)
		}
	}
})();
