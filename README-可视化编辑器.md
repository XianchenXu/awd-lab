# AWD Lab 可视化编辑器使用指南（不需要编程）

## 打开编辑器

网站上传至 GitHub Pages 后，访问 `https://你的用户名.github.io/editor.html`。也可点击公开网站底部的“内容编辑器”。

**安全提示**：此页面是本地表单工具，不含登录系统、权限控制或后台服务器。任何人都能访问页面，但它**不能直接修改 GitHub**；只有拥有仓库写入权限的人，才能上传导出的文件。编辑器会在当前浏览器中暂存修改，公共电脑请勿填写非公开信息。

## 修改内容

1. 左边选 Home / Research / People / Publications / Teaching / News / Album / Links / Site。
2. 直接在输入框填写中文和英文，列表栏目可新增、删除、上移、下移。
3. 点击“下载本栏目 .js”，例如 People 下载 `people.js`。
4. 在 GitHub 网站仓库的 `content/` 文件夹使用 `Add file → Upload files` 上传下载的同名文件，并 Commit changes。Home 的文件是 `content/home.js`；其他 7 栏同理。**Site 的 `site.js` 放在仓库根目录，不是 content/**。
5. 若 GitHub 网页不允许通过上传直接覆盖同名文件，可先在仓库对应文件页面选择删除、提交，再上传新文件；更推荐在 GitHub 网页点击铅笔编辑原文件，然后把导出文件内容粘贴替换并提交。
6. 部署完成后刷新网站检查是否生效。

## 上传照片和 PDF

先将照片或讲义文件放进仓库 `assets/` 文件夹，再在编辑器的路径字段填写 `assets/group-photo.jpg` 或 `assets/lecture1.pdf`。编辑器仅管理照片的路径和说明，**不会自动上传图片**。

## 操作注意事项

- 编辑器在浏览器 localStorage 内自动暂存；清理浏览器缓存、更换设备可能丢失未导出的修改。每次完成后请及时下载文件。
- 下载文件不等于发布，必须 Commit 到 GitHub 才会真正上线。
- 如果你已经在 GitHub 上更新了原文件，而编辑器此前还存有老草稿，点击“恢复网站原始内容”会读取本次加载的 GitHub 文件版本。
- `site.js` 包含公开邮箱与院校地址；如果没有公开邮箱，可以暂时留空。
- 论文示例和招生资料请正式上线前核实。
