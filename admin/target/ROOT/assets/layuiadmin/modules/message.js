layui.define(['form', 'drawer'], function (exports) {
    class Message {
        constructor() {
            // 消息队列
            this.messageQueue = [];
            // 设置默认值
            this.position = 'top';
            this.message = '';
            this.type = '';
            this.duration = 3000;
            this.body = document.getElementsByTagName('body')[0];
            this.id = 0;
        }

        setType(messageDom, type) {
            if (type === '') {
                messageDom.classList.add('ui-message-info');
            } else if (type === 'success') {
                messageDom.classList.add('ui-message-success');
                messageDom.children[0].children[0].style.color = "#67c23c";
            } else if (type === 'warning') {
                messageDom.classList.add('ui-message-warning');
                messageDom.children[0].children[0].style.color = "#e6a23c";
            } else if (type === 'error') {
                messageDom.classList.add('ui-message-error');
                messageDom.children[0].children[0].style.color = "#f56c6c";
            } else {
                messageDom.classList.add('ui-message-info');// 默认值
            }
        }

        createTextDom(messageDom, message,type,titletext) {
            const p = document.createElement('div');
            p.classList.add('notification_group');
            const title = document.createElement('h2');
            title.classList.add("notification_title");
            //title.innerText = message || this.message;
             title.innerText =titletext;
            p.appendChild(title);
            const content = document.createElement('div');
            content.classList.add("notification_content");
            content.innerHTML = "<p>" + message + "</p>";
            p.appendChild(content);
            // p.textContent = message || this.message;
            messageDom.appendChild(p);
        }

        removeMessageDom(messageDom, targetId) {
            const startIndex = this.messageQueue.findIndex(message => message.id === targetId);
            this.messageQueue.splice(startIndex, 1);
            this.updateMessageDom(startIndex);
            //增加移除动画
            messageDom.classList.add('ui-message-leave');
            setTimeout(() => {
                this.body.removeChild(messageDom);
            }, 400);
        }

        setOption(options) {
            if (typeof options !== "object") {
                options = {};
            }
            const messageDom = document.createElement('div');
            messageDom.classList.add('ui-message');
            messageDom.classList.add('ui-message-leave');
            if (options.center === true) {
                messageDom.classList.add('ui-message-center');
            }
            const targetId = this.id;
            this.messageQueue.push({
                id: targetId,
                messageDom,
            });

            this.createTextDom(messageDom, options.message,options.type,options.title);
            this.setType(messageDom, options.type);
            this.setCurrentMessageDom();
            this.body.appendChild(messageDom);
            //增加新增动画
            setTimeout(() => {
                messageDom.classList.remove('ui-message-leave');
            }, 100);
            let i = null;
            if (options.showClose === true) {
                i = document.createElement('i');
                i.classList.add("layui-icon");
                i.classList.add('layui-icon-close');
                i.classList.add('close-button');
                messageDom.appendChild(i);
            }
            const time = isNaN(Number(options.duration)) ? this.duration : Number(options.duration);
            // 如果duration为0则不需要setTimeout
            let timeId = -1;
            if (time !== 0) {
                timeId = setTimeout(() => {
                    this.removeMessageDom(messageDom, targetId);
                }, time);
            }
            if (options.showClose === true) {
                i.addEventListener('click', () => {
                    this.removeMessageDom(messageDom, targetId);
                    if (targetId !== -1) {
                        clearTimeout(timeId);
                    }
                });
            }
            this.id++;
        }

        setCurrentMessageDom() {
            const index = this.messageQueue.length - 1;
            const targetDom = this.messageQueue[index].messageDom;
            targetDom.style.zIndex = `${2000 + index}`;
            targetDom.style.top = `${100 * index + 20}px`;
        }

        updateMessageDom(startIndex) {
            for (let i = startIndex; i < this.messageQueue.length; i++) {
                const messageDom = this.messageQueue[i].messageDom;
                messageDom.style.zIndex = `${2000 + i}`;
                // 暂不支持换行功能，换行后获取上一个元素的height和top来更新下一个元素的top
                messageDom.style.top = `${100 * i + 20}px`;
            }
        }
    }

    function sendMessage(message,type,content,title) {
        //const message = new Message();
        switch(type){
            case "info":
                message.setOption({
                    message:'提示',
                    title:title,
                    duration:3000
                });
                break;
            case "success":
                message.setOption({
                    message: content,
                    title:title,
                    type: "success",
                    duration: 3000,
                });
                break;
            case "error":
                message.setOption({
                    message: content,
                    title:title,
                    showClose: true,
                    type: "error",
                    duration: 0,
                });
                break;
            case "warning":
                message.setOption({
                    message: content,
                    title:title,
                    showClose: true,
                    type: "warning",
                    duration: 5000,
                });
                break;
        }
    }

    var message_send={
        sendMessage:function (msg,type,content,title) {
            sendMessage(msg,type,content,title);
        },
        initMessage:function () {
            let msg = new Message();
            return  msg;
        }
    }

    exports('message', message_send)
});