angular.module("ui.bootstrap",["ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.collapse","ui.bootstrap.dialog","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.popover","ui.bootstrap.tabs","ui.bootstrap.tooltip","ui.bootstrap.transition","ui.bootstrap.typeahead"]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(e,t,n){this.groups=[],this.closeOthers=function(r){var i=angular.isDefined(t.closeOthers)?e.$eval(t.closeOthers):n.closeOthers;i&&angular.forEach(this.groups,function(e){e!==r&&(e.isOpen=!1)})},this.addGroup=function(e){var t=this;this.groups.push(e),e.$on("$destroy",function(n){t.removeGroup(e)})},this.removeGroup=function(e){var t=this.groups.indexOf(e);t!==-1&&this.groups.splice(this.groups.indexOf(e),1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",["$parse","$transition","$timeout",function(e,t,n){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@"},controller:["$scope",function(e){this.setHeading=function(e){this.heading=e}}],link:function(t,n,r,i){var s,o;i.addGroup(t),t.isOpen=!1,r.isOpen&&(s=e(r.isOpen),o=s.assign,t.$watch(function(){return s(t.$parent)},function(n){t.isOpen=n}),t.isOpen=s?s(t.$parent):!1),t.$watch("isOpen",function(e){e&&i.closeOthers(t),o&&o(t.$parent,e)})}}}]).directive("accordionHeading",function(){return{restrict:"E",transclude:!0,template:"",replace:!0,require:"^accordionGroup",compile:function(e,t,n){return function(t,r,i,s){s.setHeading(n(t,function(){}))}}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(e,t,n,r){e.$watch(function(){return r[n.accordionTransclude]},function(e){e&&(t.html(""),t.append(e))})}}}),angular.module("ui.bootstrap.alert",[]).directive("alert",function(){return{restrict:"EA",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"=",close:"&"}}}),angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).directive("btnRadio",["buttonConfig",function(e){var t=e.activeClass||"active",n=e.toggleEvent||"click";return{require:"ngModel",link:function(e,r,i,s){var o=e.$eval(i.btnRadio);e.$watch(function(){return s.$modelValue},function(e){angular.equals(e,o)?r.addClass(t):r.removeClass(t)}),r.bind(n,function(){r.hasClass(t)||e.$apply(function(){s.$setViewValue(o)})})}}}]).directive("btnCheckbox",["buttonConfig",function(e){var t=e.activeClass||"active",n=e.toggleEvent||"click";return{require:"ngModel",link:function(e,r,i,s){var o=e.$eval(i.btnCheckboxTrue),u=e.$eval(i.btnCheckboxFalse);o=angular.isDefined(o)?o:!0,u=angular.isDefined(u)?u:!1,e.$watch(function(){return s.$modelValue},function(e){angular.equals(e,o)?r.addClass(t):r.removeClass(t)}),r.bind(n,function(){e.$apply(function(){s.$setViewValue(r.hasClass(t)?u:o)})})}}}]),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$transition","$q",function(e,t,n,r){function f(){function n(){a?(e.next(),f()):e.pause()}u&&t.cancel(u);var r=+e.interval;!isNaN(r)&&r>=0&&(u=t(n,r))}var i=this,s=i.slides=[],o=-1,u,a;i.currentSlide=null,i.select=function(r,u){function l(){i.currentSlide&&angular.isString(u)&&!e.noTransition&&r.$element?(r.$element.addClass(u),r.$element[0].offsetWidth=r.$element[0].offsetWidth,angular.forEach(s,function(e){angular.extend(e,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(r,{direction:u,active:!0,entering:!0}),angular.extend(i.currentSlide||{},{direction:u,leaving:!0}),e.$currentTransition=n(r.$element,{}),function(t,n){e.$currentTransition.then(function(){c(t,n)},function(){c(t,n)})}(r,i.currentSlide)):c(r,i.currentSlide),i.currentSlide=r,o=a,f()}function c(t,n){angular.extend(t,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(n||{},{direction:"",active:!1,leaving:!1,entering:!1}),e.$currentTransition=null}var a=s.indexOf(r);u===undefined&&(u=a>o?"next":"prev"),r&&r!==i.currentSlide&&(e.$currentTransition?(e.$currentTransition.cancel(),t(l)):l())},i.indexOfSlide=function(e){return s.indexOf(e)},e.next=function(){var e=(o+1)%s.length;return i.select(s[e],"next")},e.prev=function(){var e=o-1<0?s.length-1:o-1;return i.select(s[e],"prev")},e.select=function(e){i.select(e)},e.isActive=function(e){return i.currentSlide===e},e.slides=function(){return s},e.$watch("interval",f),e.play=function(){a||(a=!0,f())},e.pause=function(){a=!1,u&&t.cancel(u)},i.addSlide=function(t,n){t.$element=n,s.push(t),s.length===1||t.active?(i.select(s[s.length-1]),s.length==1&&e.play()):t.active=!1},i.removeSlide=function(e){var t=s.indexOf(e);s.splice(t,1),s.length>0&&e.active&&(t>=s.length?i.select(s[t-1]):i.select(s[t]))}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"="}}}]).directive("slide",[function(){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{active:"="},link:function(e,t,n,r){r.addSlide(e,t),e.$on("$destroy",function(){r.removeSlide(e)}),e.$watch("active",function(t){t&&r.select(e)})}}}]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(e){var t=function(e,t,n){t.removeClass("collapse"),t.css({height:n});var r=t[0].offsetWidth;t.addClass("collapse")};return{link:function(n,r,i){var s,o=!0;n.$watch(function(){return r[0].scrollHeight},function(e){r[0].scrollHeight!==0&&(s||(o?t(n,r,r[0].scrollHeight+"px"):t(n,r,"auto")))}),n.$watch(i.collapse,function(e){e?l():f()});var u,a=function(t){return u&&u.cancel(),u=e(r,t),u.then(function(){u=undefined},function(){u=undefined}),u},f=function(){o?(o=!1,s||t(n,r,"auto")):a({height:r[0].scrollHeight+"px"}).then(function(){s||t(n,r,"auto")}),s=!1},l=function(){s=!0,o?(o=!1,t(n,r,0)):(t(n,r,r[0].scrollHeight+"px"),a({height:"0"}))}}}}]);var dialogModule=angular.module("ui.bootstrap.dialog",["ui.bootstrap.transition"]);dialogModule.controller("MessageBoxController",["$scope","dialog","model",function(e,t,n){e.title=n.title,e.message=n.message,e.buttons=n.buttons,e.close=function(e){t.close(e)}}]),dialogModule.provider("$dialog",function(){var e={backdrop:!0,dialogClass:"modal",backdropClass:"modal-backdrop",transitionClass:"fade",triggerClass:"in",dialogOpenClass:"modal-open",resolve:{},backdropFade:!1,dialogFade:!1,keyboard:!0,backdropClick:!0},t={},n={value:0};this.options=function(e){t=e},this.$get=["$http","$document","$compile","$rootScope","$controller","$templateCache","$q","$transition","$injector",function(r,i,s,o,u,a,f,l,c){function p(e){var t=angular.element("<div>");return t.addClass(e),t}function d(n){var r=this,i=this.options=angular.extend({},e,t,n);this.backdropEl=p(i.backdropClass),i.backdropFade&&(this.backdropEl.addClass(i.transitionClass),this.backdropEl.removeClass(i.triggerClass)),this.modalEl=p(i.dialogClass),i.dialogFade&&(this.modalEl.addClass(i.transitionClass),this.modalEl.removeClass(i.triggerClass)),this.handledEscapeKey=function(e){e.which===27&&(r.close(),e.preventDefault(),r.$scope.$apply())},this.handleBackDropClick=function(e){r.close(),e.preventDefault(),r.$scope.$apply()}}var h=i.find("body");return d.prototype.isOpen=function(){return this._open},d.prototype.open=function(e,t){var n=this,r=this.options;e&&(r.templateUrl=e),t&&(r.controller=t);if(!r.template&&!r.templateUrl)throw new Error("Dialog.open expected template or templateUrl, neither found. Use options or open method to specify them.");return this._loadResolves().then(function(e){var t=e.$scope=n.$scope=e.$scope?e.$scope:o.$new();n.modalEl.html(e.$template);if(n.options.controller){var r=u(n.options.controller,e);n.modalEl.contents().data("ngControllerController",r)}s(n.modalEl)(t),n._addElementsToDom(),h.addClass(n.options.dialogOpenClass),setTimeout(function(){n.options.dialogFade&&n.modalEl.addClass(n.options.triggerClass),n.options.backdropFade&&n.backdropEl.addClass(n.options.triggerClass)}),n._bindEvents()}),this.deferred=f.defer(),this.deferred.promise},d.prototype.close=function(e){function i(e){e.removeClass(t.options.triggerClass)}function s(){t._open&&t._onCloseComplete(e)}var t=this,n=this._getFadingElements();h.removeClass(t.options.dialogOpenClass);if(n.length>0){for(var r=n.length-1;r>=0;r--)l(n[r],i).then(s);return}this._onCloseComplete(e)},d.prototype._getFadingElements=function(){var e=[];return this.options.dialogFade&&e.push(this.modalEl),this.options.backdropFade&&e.push(this.backdropEl),e},d.prototype._bindEvents=function(){this.options.keyboard&&h.bind("keydown",this.handledEscapeKey),this.options.backdrop&&this.options.backdropClick&&this.backdropEl.bind("click",this.handleBackDropClick)},d.prototype._unbindEvents=function(){this.options.keyboard&&h.unbind("keydown",this.handledEscapeKey),this.options.backdrop&&this.options.backdropClick&&this.backdropEl.unbind("click",this.handleBackDropClick)},d.prototype._onCloseComplete=function(e){this._removeElementsFromDom(),this._unbindEvents(),this.deferred.resolve(e)},d.prototype._addElementsToDom=function(){h.append(this.modalEl),this.options.backdrop&&(n.value===0&&h.append(this.backdropEl),n.value++),this._open=!0},d.prototype._removeElementsFromDom=function(){this.modalEl.remove(),this.options.backdrop&&(n.value--,n.value===0&&this.backdropEl.remove()),this._open=!1},d.prototype._loadResolves=function(){var e=[],t=[],n,i=this;return this.options.template?n=f.when(this.options.template):this.options.templateUrl&&(n=r.get(this.options.templateUrl,{cache:a}).then(function(e){return e.data})),angular.forEach(this.options.resolve||[],function(n,r){t.push(r),e.push(angular.isString(n)?c.get(n):c.invoke(n))}),t.push("$template"),e.push(n),f.all(e).then(function(e){var n={};return angular.forEach(e,function(e,r){n[t[r]]=e}),n.dialog=i,n})},{dialog:function(e){return new d(e)},messageBox:function(e,t,n){return new d({templateUrl:"template/dialog/message.html",controller:"MessageBoxController",resolve:{model:function(){return{title:e,message:t,buttons:n}}}})}}}]}),angular.module("ui.bootstrap.dropdownToggle",[]).directive("dropdownToggle",["$document","$location","$window",function(e,t,n){var r=null,i;return{restrict:"CA",link:function(n,s,o){n.$watch(function(){return t.path()},function(){i&&i()}),s.parent().bind("click",function(e){i&&i()}),s.bind("click",function(t){t.preventDefault(),t.stopPropagation();var n=!1;r&&(n=r===s,i()),n||(s.parent().addClass("open"),r=s,i=function(t){t&&(t.preventDefault(),t.stopPropagation()),e.unbind("click",i),s.parent().removeClass("open"),i=null,r=null},e.bind("click",i))})}}}]),angular.module("ui.bootstrap.modal",["ui.bootstrap.dialog"]).directive("modal",["$parse","$dialog",function(e,t){var n,r=angular.element(document.getElementsByTagName("body")[0]);return{restrict:"EA",terminal:!0,link:function(n,r,i){var s=angular.extend({},n.$eval(i.uiOptions||i.bsOptions||i.options)),o=i.modal||i.show,u;s=angular.extend(s,{template:r.html(),resolve:{$scope:function(){return n}}});var a=t.dialog(s);r.remove(),i.close?u=function(){e(i.close)(n)}:u=function(){angular.isFunction(e(o).assign)&&e(o).assign(n,!1)},n.$watch(o,function(e,t){e?a.open().then(function(){u()}):a.isOpen()&&a.close()})}}}]),angular.module("ui.bootstrap.pagination",[]).constant("paginationConfig",{boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last"}).directive("pagination",["paginationConfig",function(e){return{restrict:"EA",scope:{numPages:"=",currentPage:"=",maxSize:"=",onSelectPage:"&"},templateUrl:"template/pagination/pagination.html",replace:!0,link:function(t,n,r){function l(e,t,n,r){return{number:e,text:t,active:n,disabled:r}}var i=angular.isDefined(r.boundaryLinks)?t.$eval(r.boundaryLinks):e.boundaryLinks,s=angular.isDefined(r.directionLinks)?t.$eval(r.directionLinks):e.directionLinks,o=angular.isDefined(r.firstText)?r.firstText:e.firstText,u=angular.isDefined(r.previousText)?r.previousText:e.previousText,a=angular.isDefined(r.nextText)?r.nextText:e.nextText,f=angular.isDefined(r.lastText)?r.lastText:e.lastText;t.$watch("numPages + currentPage + maxSize",function(){t.pages=[];var e=t.maxSize&&t.maxSize<t.numPages?t.maxSize:t.numPages,n=t.currentPage-Math.floor(e/2);n<1&&(n=1),n+e-1>t.numPages&&(n-=n+e-1-t.numPages);for(var r=n,c=n+e;r<c;r++){var h=l(r,r,t.isActive(r),!1);t.pages.push(h)}if(s){var p=l(t.currentPage-1,u,!1,t.noPrevious());t.pages.unshift(p);var d=l(t.currentPage+1,a,!1,t.noNext());t.pages.push(d)}if(i){var v=l(1,o,!1,t.noPrevious());t.pages.unshift(v);var m=l(t.numPages,f,!1,t.noNext());t.pages.push(m)}t.currentPage>t.numPages&&t.selectPage(t.numPages)}),t.noPrevious=function(){return t.currentPage===1},t.noNext=function(){return t.currentPage===t.numPages},t.isActive=function(e){return t.currentPage===e},t.selectPage=function(e){!t.isActive(e)&&e>0&&e<=t.numPages&&(t.currentPage=e,t.onSelectPage({page:e}))}}}}]),angular.module("ui.bootstrap.popover",[]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{popoverTitle:"@",popoverContent:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$compile","$timeout","$parse","$window",function(e,t,n,r){var i='<popover-popup popover-title="{{tt_title}}" popover-content="{{tt_popover}}" placement="{{tt_placement}}" animation="tt_animation()" is-open="tt_isOpen"></popover-popup>';return{scope:!0,link:function(s,o,u){function l(){var e=o[0].getBoundingClientRect();return{width:o.prop("offsetWidth"),height:o.prop("offsetHeight"),top:e.top+r.pageYOffset,left:e.left+r.pageXOffset}}function c(){var e,n,r,i;f&&t.cancel(f),a.css({top:0,left:0,display:"block"}),o.after(a),e=l(),n=a.prop("offsetWidth"),r=a.prop("offsetHeight");switch(s.tt_placement){case"right":i={top:e.top+e.height/2-r/2+"px",left:e.left+e.width+"px"};break;case"bottom":i={top:e.top+e.height+"px",left:e.left+e.width/2-n/2+"px"};break;case"left":i={top:e.top+e.height/2-r/2+"px",left:e.left-n+"px"};break;default:i={top:e.top-r+"px",left:e.left+e.width/2-n/2+"px"}}a.css(i),s.tt_isOpen=!0}function h(){s.tt_isOpen=!1,angular.isDefined(s.tt_animation)&&s.tt_animation()?f=t(function(){a.remove()},500):a.remove()}var a=e(i)(s),f;u.$observe("popover",function(e){s.tt_popover=e}),u.$observe("popoverTitle",function(e){s.tt_title=e}),u.$observe("popoverPlacement",function(e){s.tt_placement=e||"top"}),u.$observe("popoverAnimation",function(e){s.tt_animation=n(e)}),s.tt_isOpen=!1,o.bind("click",function(){s.tt_isOpen?s.$apply(h):s.$apply(c)})}}}]),angular.module("ui.bootstrap.tabs",[]).controller("TabsController",["$scope","$element",function(e,t){var n=e.panes=[];this.select=e.select=function(t){angular.forEach(n,function(e){e.selected=!1}),t.selected=!0},this.addPane=function(r){n.length||e.select(r),n.push(r)},this.removePane=function(r){var i=n.indexOf(r);n.splice(i,1),r.selected&&n.length>0&&e.select(n[i<n.length?i:i-1])}}]).directive("tabs",function(){return{restrict:"EA",transclude:!0,scope:{},controller:"TabsController",templateUrl:"template/tabs/tabs.html",replace:!0}}).directive("pane",["$parse",function(e){return{require:"^tabs",restrict:"EA",transclude:!0,scope:{heading:"@"},link:function(t,n,r,i){var s,o;t.selected=!1,r.active&&(s=e(r.active),o=s.assign,t.$watch(function(){return s(t.$parent)},function(n){t.selected=n}),t.selected=s?s(t.$parent):!1),t.$watch("selected",function(e){e&&i.select(t),o&&o(t.$parent,e)}),i.addPane(t),t.$on("$destroy",function(){i.removePane(t)})},templateUrl:"template/tabs/pane.html",replace:!0}}]),angular.module("ui.bootstrap.tooltip",[]).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{tooltipTitle:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$compile","$timeout","$parse","$window",function(e,t,n,r){var i='<tooltip-popup tooltip-title="{{tt_tooltip}}" placement="{{tt_placement}}" animation="tt_animation()" is-open="tt_isOpen"></tooltip-popup>';return{scope:!0,link:function(s,o,u){function l(){var e=o[0].getBoundingClientRect();return{width:o.prop("offsetWidth"),height:o.prop("offsetHeight"),top:e.top+r.pageYOffset,left:e.left+r.pageXOffset}}function c(){var e,n,r,i;if(!s.tt_tooltip)return;f&&t.cancel(f),a.css({top:0,left:0,display:"block"}),o.after(a),e=l(),n=a.prop("offsetWidth"),r=a.prop("offsetHeight");switch(s.tt_placement){case"right":i={top:e.top+e.height/2-r/2+"px",left:e.left+e.width+"px"};break;case"bottom":i={top:e.top+e.height+"px",left:e.left+e.width/2-n/2+"px"};break;case"left":i={top:e.top+e.height/2-r/2+"px",left:e.left-n+"px"};break;default:i={top:e.top-r+"px",left:e.left+e.width/2-n/2+"px"}}a.css(i),s.tt_isOpen=!0}function h(){s.tt_isOpen=!1,angular.isDefined(s.tt_animation)&&s.tt_animation()?f=t(function(){a.remove()},500):a.remove()}var a=e(i)(s),f;u.$observe("tooltip",function(e){s.tt_tooltip=e}),u.$observe("tooltipPlacement",function(e){s.tt_placement=e||"top"}),u.$observe("tooltipAnimation",function(e){s.tt_animation=n(e)}),s.tt_isOpen=!1,o.bind("mouseenter",function(){s.$apply(c)}),o.bind("mouseleave",function(){s.$apply(h)})}}}]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(e,t,n){function u(e){for(var t in e)if(i.style[t]!==undefined)return e[t]}var r=function(i,s,o){o=o||{};var u=e.defer(),a=r[o.animation?"animationEndEventName":"transitionEndEventName"],f=function(e){n.$apply(function(){i.unbind(a,f),u.resolve(i)})};return a&&i.bind(a,f),t(function(){angular.isString(s)?i.addClass(s):angular.isFunction(s)?s(i):angular.isObject(s)&&i.css(s),a||u.resolve(i)}),u.promise.cancel=function(){a&&i.unbind(a,f),u.reject("Transition cancelled")},u.promise},i=document.createElement("trans"),s={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},o={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",msTransition:"MSAnimationEnd",transition:"animationend"};return r.transitionEndEventName=u(s),r.animationEndEventName=u(o),r}]),angular.module("ui.bootstrap.typeahead",[]).factory("typeaheadParser",["$parse",function(e){var t=/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;return{parse:function(n){var r=n.match(t),i,s,o;if(!r)throw new Error("Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_' but got '"+n+"'.");return{itemName:r[3],source:e(r[4]),viewMapper:e(r[2]||r[1]),modelMapper:e(r[1])}}}}]).directive("typeahead",["$compile","$q","typeaheadParser",function(e,t,n){var r=[9,13,27,38,40];return{require:"ngModel",link:function(i,s,o,u){var a=u.$modelValue,f=i.$eval(o.typeaheadMinLength)||1,l=n.parse(o.typeahead),c=i.$new();i.$on("$destroy",function(){c.$destroy()});var h=function(){c.matches=[],c.activeIdx=-1},p=function(e){var n={$viewValue:e};t.when(l.source(c,n)).then(function(t){if(e===u.$viewValue)if(t.length>0){c.activeIdx=0,c.matches.length=0;for(var r=0;r<t.length;r++)n[l.itemName]=t[r],c.matches.push({label:l.viewMapper(c,n),model:t[r]});c.query=e}else h()},h)};h(),c.query=undefined,u.$parsers.push(function(e){return h(),a?e:(e&&e.length>=f&&p(e),undefined)}),u.$render=function(){var e={};e[l.itemName]=a,s.val(l.viewMapper(c,e)||u.$viewValue),a=undefined},c.select=function(e){var t={};t[l.itemName]=a=c.matches[e].model,u.$setViewValue(l.modelMapper(c,t)),u.$render()},s.bind("keydown",function(e){if(c.matches.length===0||r.indexOf(e.which)===-1)return;e.preventDefault(),e.which===40?(c.activeIdx=(c.activeIdx+1)%c.matches.length,c.$digest()):e.which===38?(c.activeIdx=(c.activeIdx?c.activeIdx:c.matches.length)-1,c.$digest()):e.which===13||e.which===9?c.$apply(function(){c.select(c.activeIdx)}):e.which===27&&(c.matches=[],c.$digest())});var d=e("<typeahead-popup matches='matches' active='activeIdx' select='select(activeIdx)' query='query'></typeahead-popup>")(c);s.after(d)}}}]).directive("typeaheadPopup",function(){return{restrict:"E",scope:{matches:"=",query:"=",active:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead.html",link:function(e,t,n){e.isOpen=function(){return e.matches.length>0},e.isActive=function(t){return e.active==t},e.selectActive=function(t){e.active=t},e.selectMatch=function(t){e.select({activeIdx:t})}}}}).filter("typeaheadHighlight",function(){return function(e,t){return t?e.replace(new RegExp(t,"gi"),"<strong>$&</strong>"):t}});