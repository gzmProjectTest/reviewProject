drawImg(detail, left) {
    swan.showLoading({
        title: '保存图片中',
        mask: false
    })
    const { width, height, unit } = this;
    // 初始化画布高度
    const det= detail.body[0];
    let startPoint = 110;
    let endPoint = 1229;
    for(let i = 1; i < det.length; i++) {
        if (startPoint > 1076) {
            startPoint = 110;
            endPoint += 87;
        } else {
            startPoint += 57;
        }
    }

    if ((endPoint + 60)/unit > this.height) {
        this.height = (endPoint + 60) / unit + 105 + 100;
    }


    // 创建绘制上下文
    let context = swan.createCanvasContext('share');
    context.setFillStyle('#fff')    //这里是绘制白底，让图片有白色的背景
    context.fillRect(0, 0, this.width, this.height);
    // 绘制日期
    context.setFontSize(parseInt(120/unit));
    context.setFillStyle("#000000");
    context.fillText(detail.day, 51/unit, 193/unit);

    // 绘制线条
    context.beginPath();
    context.moveTo(left * 3, 107/unit);
    context.lineTo(left * 3, 194/unit);
    context.setLineWidth(1);
    context.setStrokeStyle('#000000');
    context.stroke();
    context.closePath();
    // 绘制星期几
    context.setFontSize(parseInt(39/unit));
    context.setFillStyle("#333333");
    context.fillText(`${detail.week}`, 215/unit, 142/unit);

    // 绘制年份和月份
    context.setFontSize(parseInt(39/unit));
    context.setFillStyle("#333333");
    context.fillText(`${detail.year}.${detail.month}`, 215/unit, 190/unit);
    
    // 绘制农历时间
    context.setFontSize(parseInt(36/unit));
    context.setFillStyle("#666666");
    context.fillText(detail.lunar, 966/unit, 196/unit);

    // 绘制图像
    context.drawImage(detail.img_url, 48/unit, 230/unit, 1139/unit, 770/unit);

    // 绘制图片作者和出处(从后往前写)
    context.setFontSize(parseInt(33/unit));
    context.setFillStyle("#ffffff");
    const author = `${detail.img_name}｜${detail.img_author}`;
    let s = 1118;
    let len = author.length;
    while(len > 0) {
        len --;
        context.fillText(author[len], s/unit, 930/unit);
        s -= 32;
    }

    // 绘制边框
    context.beginPath();
    context.moveTo(0, 1129/unit);
    context.lineTo(width, 1129/unit);
    context.setLineWidth(18/unit);
    context.setStrokeStyle('#F9F9F9');
    context.stroke();
    context.closePath();

    // 绘制文案（从前往后）
    context.setFontSize(parseInt(57/unit));
    context.setFillStyle("#333333");
    const des = detail.body[0];
    let start = 110;
    let end = 1229;
    context.fillText(des[0], start/unit, end/unit);
    for(let i = 1; i < des.length; i++) {
        if (start > 1076) {
            start = 110;
            end += 87;
        } else {
            start += 57;
        }
        context.fillText(des[i], start/unit, end/unit);
        
    }
    
    // 绘制文案的作者和出处
    context.setFontSize(parseInt(45/unit));
    context.setFillStyle("#999999");
    const author1 = detail.name ? `${detail.literature_author}《${detail.name}》` : detail.literature_author;
    let s1 = 1145;
    let len1 = author1.length;
    while(len1 > 0) {
        len1 --;
        s1 -= 45;
        context.fillText(author1[len1], s1/unit, (end+60)/unit);
    }
    
    if (detail.name || detail.literature_author) {
        // 绘制边框
        context.beginPath();
        context.moveTo((s1-20)/unit, (end+42)/unit);
        context.lineTo((s1-80)/unit, (end+42)/unit);
        context.setLineWidth(1);
        context.setStrokeStyle('#999999');
        context.stroke();
        context.closePath();
    }
    
    // 绘制百度汉语
    context.setFontSize(parseInt(45/unit));
    context.setFillStyle("#999999");
    context.fillText('百度汉语', 527/unit, this.height-100/unit);

    context.draw(false, () => {
        swan.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            destWidth: this.width,
            destHeight: this.height,
            canvasId: 'share',
            success:a=>{
                swan.authorize({
                    scope:'scope.writePhotosAlbum',
                    success: res => {
                        swan.saveImageToPhotosAlbum({
                            filePath: a.tempFilePath, // 暂不支持网络图片/本地图片地址，需与swan.downloadFile一起使用
                            success: res => {
                                swan.hideLoading();
                                swan.showToast({
                                    title: '保存成功',
                                    icon: 'none'
                                });
                                this.isSave = false;
                                logger.sendClk('saveIamge');
                            },
                            fail: err => {
                                swan.hideLoading();
                                swan.showToast({
                                    title: '保存失败',
                                    icon: 'none'
                                });
                                this.isSave = false;
                            }
                        });
                    },
                    fail: err => {
                        swan.hideLoading();
                        swan.showToast({
                            title: '授权失败',
                            icon: 'none'
                        });
                        this.isSave = false;
                    }
                });             
            },
            fail: e => {
                swan.hideLoading();
                swan.showToast({
                    title: '保存失败了',
                    icon: 'none'
                });
                this.isSave = false;
            }
        });
    });  
}