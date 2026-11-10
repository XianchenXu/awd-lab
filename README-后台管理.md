# Acoustic & Wave Dynamic Lab — GitHub 在线管理后台

## 一、网站部署
1. 解压 ZIP，把**文件夹内部**所有文件/文件夹上传到 GitHub 网站仓库的根目录（`index.html` 必须在根目录）。旧版本需整包替换/补齐，尤其 `editor.html`、`admin.js`、`site.js`、`content/`。
2. GitHub 仓库 → Settings → Pages → Deploy from a branch → `main` + `/(root)`。
3. 访问 `https://你的用户名.github.io/` 查看网站；访问 `https://你的用户名.github.io/editor.html` 打开管理后台。
4. 如果使用的是项目仓库（不是 username.github.io 仓库），访问地址会有额外的 `/仓库名/` 路径，页面中的相对资源路径可继续工作。

## 二、创建仅限实验室仓库的管理令牌
1. 登录 GitHub，打开 https://github.com/settings/personal-access-tokens/new 。
2. Token name：例如 `AWD Lab website editor`；Expiration 建议 30–90 天。
3. Resource owner：选择拥有网站仓库的个人或组织。
4. Repository access → **Only select repositories** → 只勾选实验室网站仓库。
5. Repository permissions → **Contents → Read and write**。无需授予 Administration、Actions、Secrets 权限。
6. Generate token，立即复制并妥善保管：它和密码一样重要。**不要**把令牌发给他人、粘贴进网站代码、截图或提交到 GitHub。
7. 在 `editor.html` 输入 owner、repo、branch（一般是 `main`）、Token，点击 **连接 GitHub**。令牌仅保留当前网页内存，不保存到浏览器 localStorage，不随文件提交。刷新页面后需要重新粘贴。

## 三、编辑和发布
1. 在左侧选择 Home / Research / People / Publications / Teaching / News / Album / Links / Site。
2. 点击添加/删除/编辑，信息会作为本地草稿暂存于浏览器。
3. **点击「直接发布当前栏目」**，确认后网页会通过 GitHub REST API 更新对应文件（`content/*.js` 或 `site.js`）。网站会在 GitHub Pages 构建后显示更新内容。
4. 每个栏目需单独发布。一个栏目完成后再切换到下一个栏目。
5. 如同时有多个管理员，后台会检测远程文件版本；有冲突则停止发布，不会悄悄覆盖其他人的修改。请使用「下载本栏目 .js」保存本地草稿，再「读取远程当前栏目」并人工合并。
6. 保留「下载本栏目 .js」作为备份；**不联网时也可以填写和下载**，但不能直接发布。

## 四、图片/讲义上传
1. 在编辑器最下方选择 PNG/JPG/WEBP/GIF/SVG/PDF（最多 5 MB）。
2. 输入英文文件名，点击「上传图片 / PDF」。后台会直接提交 `assets/文件名`；如果遇到同名文件，会二次确认。
3. 点击生成的路径输入框复制路径，例如 `assets/2026-group.jpg`。
4. 在 People 的 photo、Research 的 image、Album 的 src 或 Teaching 的 resource 粘贴路径，再发布该栏目。
5. 公开站点可以查看上传的图片和 PDF。**不要上传任何未授权使用或含私人信息的文件。**

## 五、安全与边界
- **管理页面的 URL 是公开的**，任何人都可以打开表单；没有 Token 的人不能用这个后台修改 GitHub 仓库。这个方案不是 GitHub OAuth/账号登录，也不是服务器级别密码保护。
- Token 不会保存在网页代码、GitHub 仓库或 localStorage，但会在当前打开的页面 JavaScript 内存中存在，直至断开或关闭/刷新。只在可信任设备的 HTTPS 网站上使用。
- 浏览器里的编辑草稿依旧使用 localStorage，所以不要在公共电脑编辑未公开的科研或个人资料。
- 本方案使用 GitHub 原生的文件提交 API，一次直接发布一个栏目或一个资源文件。**它没有多管理员角色审批或文章草稿审核流程**；如果需要严格分级审核、账号登录和审批，请后续改成 GitHub App + 后端服务的系统。
- Token 失窃可随时在 https://github.com/settings/personal-access-tokens  撤销。
- GitHub Pages 的部署进度可在仓库 Actions / Settings → Pages 查看；刚提交并不代表网页立即上线。

## 六、常见问题
- 401：Token 错误、过期或撤销；请重新生成。
- 403：Token 没有 Contents Read/Write 权限，或组织对 Token 有限制。
- 404：仓库名、分支名不对，或 Token 未授权该仓库。
- 409 / 远程已变更：先备份草稿、同步并人工合并。
- 本地双击打开 `editor.html`：建议通过 GitHub Pages HTTPS 地址访问，避免浏览器本地安全限制；调试可使用本地 HTTP 服务。
- 文件大小：建议先压缩至 5 MB 以内；图片与讲义建议使用明确的文件名方便管理。
