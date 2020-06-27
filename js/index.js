window.addEventListener('load', function() {
    // 1. 获取元素
    var arrow_l = document.querySelector('.arrow_l')
    var arrow_r = document.querySelector('.arrow_r')
    var mainbox_l = document.querySelector('.mainbox_l')
    var mainbox_l_width = mainbox_l.offsetWidth;

    var num = 0;
    var circle = 0;
    // 定义节流阀
    var flag = true;
    // 2.给盒子添加事件:鼠标经过盒子,左右箭头盒子显示出来
    mainbox_l.addEventListener('mouseenter', function() {
            clearInterval(timer);
            // 清除定时器变量
            timer = null;
            arrow_l.style.display = 'block';
            arrow_r.style.display = 'block';
        })
        // 3.给盒子添加事件:鼠标离开盒子,左右箭头盒子隐藏
    mainbox_l.addEventListener('mouseleave', function() {
            arrow_l.style.display = 'none';
            arrow_r.style.display = 'none';
            timer = setInterval(function() {
                //手动调用点击事件
                arrow_r.click();
            }, 2000)

        })
        // 4.自动生成小圆圈circle
    var ul = mainbox_l.querySelector('ul')
    var ol = mainbox_l.querySelector('ol')
    for (var i = 0; i < ul.children.length; i++) {
        li = document.createElement('li');
        // 需要给li设置属性index后面方便调用
        li.setAttribute('index', i);
        ol.appendChild(li);
        // 给li鼠标设置一个经过,图片跳转的效果
        li.addEventListener('mouseenter', function() {
            // 先排他,实现小圆圈本身效果
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            this.className = 'current';
            var index = this.getAttribute('index');
            // 当我们点击了某个小li 就要把这个li 的索引号给 num  
            num = index;
            // 当我们点击了某个小li 就要把这个li 的索引号给 circle  
            circle = index;
            // 5.实现ul图片移动效果
            animate(ul, -mainbox_l_width * index)
        })
    }
    // 给第一个小圆圈设置默认选中属性
    ol.children[0].className = 'current';
    // 6. 克隆第一张图片(li)放到ul 最后面，注意是深拷贝
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);
    // 7. 点击右侧按钮， 图片滚动一张
    arrow_r.addEventListener('click', function() {
        if (flag) {
            flag = false; // 关闭节流阀
            // 如果走到了最后复制的一张图片，此时 我们的ul 要快速复原 left 改为 0
            if (num == ul.children.length - 1) {
                ul.style.left = 0;
                num = 0;
            }
            num++;
            animate(ul, -num * mainbox_l_width, function() {
                    flag = true;
                })
                // 8. 点击右侧按钮，小圆圈跟随一起变化 可以再声明一个变量控制小圆圈的播放
            circle++;
            if (circle == ol.children.length) {
                circle = 0;
            }
            circlechange()
        }
    })

    // 左侧按钮做法:
    arrow_l.addEventListener('click', function() {
        if (flag) {
            flag = false;
            // 首先让图片滚动起来
            if (num == 0) {
                ul.style.left = (ul.children.length - 1) * mainbox_l_width;
                num = ul.children.length - 1;
            }
            num--;
            animate(ul, -num * mainbox_l_width, function() {
                flag = true;
            })
            circle--;
            circle = circle < 0 ? ol.children.length - 1 : circle;
            circlechange();
        }
    })
    var timer = this.setInterval(function() {
        arrow_r.click();
    }, 2000)

    function circlechange() {
        for (var i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        ol.children[circle].className = 'current';
    }
})

function animate(obj, target, callback) {
    // 需要先清除定时器，防止连续点击速度变快
    clearInterval(obj.timer)
    obj.timer = setInterval(function() {
        if (obj.offsetLeft == target) {
            // 当到达目标距离时，就要清除定时器
            clearInterval(obj.timer);
            callback && callback();
        } else {
            // 计算步长,每次移动距离慢慢变小,速度慢慢落下来.核心算法:(目标值-现在位置)/10
            var step = (target - obj.offsetLeft) / 10
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            // 注意需要添加else语句，直接写会导致点击时即使到达目标位置还会动
            obj.style.left = obj.offsetLeft + step + 'px';
        }
    }, 15)
}