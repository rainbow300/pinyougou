window.addEventListener('load', function() {
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
})