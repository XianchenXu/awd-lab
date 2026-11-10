
## 新版：各栏目独立内容文件（推荐操作）

网站已经拆分为以下文件，**每个栏目只需改自己的文件**：

| 需要修改 | 打开文件 |
|---|---|
| 实验室名称、地址、公共邮箱 | `site.js` |
| Home：首页、负责人、招生信息 | `content/home.js` |
| Research：研究方向、项目和成果 | `content/research.js` |
| People：教授、博士后、学生和校友 | `content/people.js` |
| Publications：论文、年份、DOI | `content/publications.js` |
| Teaching：课程和讲义 | `content/teaching.js` |
| News：新闻动态 | `content/news.js` |
| Album：照片相册 | `content/album.js` |
| Links：合作单位、学术资源 | `content/links.js` |

**最重要：** `index.html`、`app.js`、`style.css` 属于网站程序，日常更新不用修改。
上面 8 个 `.js` 文件已由网页按正确顺序加载，不能随便改文件名。

### 不懂编程如何修改？

1. 在 GitHub 仓库进入 `content` 文件夹，点击想要修改的文件（例如 `people.js`）。
2. 点击铅笔（Edit）图标，只改引号内的文字、链接、图片路径，其他标点和符号保留。
3. 点击 `Commit changes` 提交，等待 GitHub Pages 完成新一轮部署。
4. 看网站效果。若更新失败，在 GitHub 中打开 `Actions` 查看部署日志，或撤销此次提交。

### 添加新的学生

在 `content/people.js` 中找到数组 `window.SITE_DATA.people = [`，复制现有的一条对象，使用英文逗号分隔；更改 `name`、`role`、`group` 等字段。上传图片到 `assets`，将 `photo` 写成 `assets/student.jpg`。

### 添加新论文

在 `content/publications.js` 中的数组内添加新的对象。年份必须是数字（如 `2026`），DOI 地址应是完整网页链接（如 `https://doi.org/10.xxxx/xxxx`）。论文年份筛选与关键词搜索功能会自动更新。

### 添加相册照片

先把照片上传至 `assets`，再在 `content/album.js` 添加一条包含 `src`、`caption`、`category` 的记录。照片路径要与文件名称一致。

### 本地预览提醒

这是静态网站，仍可以直接双击 `index.html` 预览大部分内容；发布到 GitHub Pages 后所有栏目通过 `content/` 子文件载入。若浏览器缓存了旧页面，强制刷新（Ctrl+F5）。

---
# AWD Lab 网站：GitHub 从零开始（无需编程基础）

## 一、你得到的是什么

这是一个**直接可以部署到 GitHub Pages 的静态实验室网站**，包含：首页、Research、People、Publications、Teaching、News、Album、Links，以及中英文切换、手机端适配、论文搜索/年份筛选、相册点开放大。

- `index.html`：网站入口（一般不用改）
- `style.css`：字体、颜色、排版（一般不用改）
- `app.js`：页面功能（一般不用改）
- `各栏目对应的 content/*.js 文件`：**你以后主要修改的文件**：负责人、研究方向、成员、论文、新闻、教学、照片和链接
- `assets/`：图片目录，已有装饰性 SVG 图；**暂无真实团队照片**

网站里部分信息仅供预览：例如论文标题、作者格式等含有“verify/待核实”提示，上线前应按真实论文核对。邮箱、个人照片、Google Scholar 链接没有擅自编造，请自行补充。

## 二、注册 GitHub

1. 打开 https://github.com/ ，点击 **Sign up** 注册，验证邮箱。
2. 选一个长期使用的用户名，比如 `awd-lab-bit`（只是示例，若已被占用须选其他用户名）。
3. 登录后右上角 `+` → **New repository**。
4. 在 Repository name 填 **`你的用户名.github.io`**（如 GitHub 用户名是 `awd-lab-bit`，仓库名就是 `awd-lab-bit.github.io`）。
5. 选择 **Public**，然后点 **Create repository**。

> 也可以使用 `awd-lab` 作为仓库名，访问地址就会是 `https://你的用户名.github.io/awd-lab/`。推荐第一种，网址更短。

## 三、上传网站文件（浏览器操作，无需 Git 命令）

1. 解压下载的 `AWD-Lab-Website.zip` 到电脑。
2. 打开刚创建的 GitHub 仓库，点击 **Add file → Upload files**。如果新仓库是完全空的，点击首页的 **uploading an existing file** 链接。
3. 打开解压后的 `AWD-Lab-Website` 文件夹，**选中里面所有文件和 assets 文件夹**，拖入上传区。注意：`index.html` 一定要在仓库根目录，**不能外面再套一层 AWD-Lab-Website 文件夹**。
4. 检查上传列表里包括 `index.html`、`style.css`、`app.js`、`各栏目对应的 content/*.js 文件` 和 `assets/...`。
5. 点击页面底部 **Commit changes** 完成上传。

如果浏览器不允许一次拖入完整文件夹，可先上传根目录文件，再用 GitHub 网页添加 `assets/` 内文件；或者使用 GitHub Desktop 免费桌面软件上传。

## 四、开启 GitHub Pages

1. 仓库页面上方 **Settings** → 左侧 **Pages**。
2. **Build and deployment** 里，**Source** 选择 **Deploy from a branch**。
3. **Branch** 选择 **main**；目录选择 **/(root)**；点击 **Save**。
4. 等待 GitHub 完成部署（通常几分钟，官方提示最长约 10 分钟）。刷新 Pages 设置页面，点击 **Visit site**。
5. 你的网址是 `https://你的用户名.github.io/`。

若出现 404：先确认文件名 `index.html` 在仓库根目录；再确认 Pages 分支为 main、目录为 /(root)。仓库需为 Public（GitHub 免费账户）。

## 五、以后如何更新内容（最重要）

1. 打开 GitHub 网站 → 进入网站仓库。
2. 单击 `各栏目对应的 content/*.js 文件` 文件。
3. 点击右上角铅笔图标 **Edit this file**。
4. 直接修改里面的文字，保留英文引号、逗号和括号结构。
5. 点击 **Commit changes**。几分钟后网站自动更新。

在 `各栏目对应的 content/*.js 文件` 里，`en` 是英文，`zh` 是中文。请同时填写两个语言字段，例如：

```js
{ en: 'Ph.D. Student', zh: '博士研究生' }
```

### 增加一个学生

在 `people` 列表里（已有徐先臣教授条目下方），新增：

```js
,{
  name: { en: 'Student Name', zh: '学生姓名' },
  role: { en: 'Ph.D. Student', zh: '博士研究生' },
  group: 'phd',
  photo: 'assets/student-name.jpg',
  email: '', website: '',
  note: { en: 'Acoustofluidics', zh: '声流体技术' }
}
```

先把相片 `student-name.jpg` 上传到仓库的 `assets/` 文件夹。可使用的 `group` 值：`pi`, `postdoc`, `phd`, `master`, `undergrad`, `alumni`。

### 增加一篇论文

在 `publications` 列表内，按已有对象格式加入（请核对真实引用信息）：

```js
,{ year: 2026, title: 'The exact title of your paper', authors: 'A. Author, B. Author', journal: 'Journal Name', doi: 'https://doi.org/xxxx', url: '', highlight: '' }
```

### 增加一条新闻

在 `news` 数组里新增：

```js
,{ date: '2026-11-10', title: { en: 'Our new paper is published', zh: '团队新论文发表' }, body: { en: 'A brief description.', zh: '新闻内容简述。' }, category: 'Publication' }
```

### 添加实验室照片

1. 在仓库点击 `assets` → **Add file → Upload files**，上传 `group-photo.jpg`。
2. 在 `各栏目对应的 content/*.js 文件` 中 `album: [ ... ]` 内增加：

```js
{ src: 'assets/group-photo.jpg', caption: { en: 'Group photo · 2026', zh: '实验室合影 · 2026' }, category: 'Group' }
```

上传公开网站的照片前，建议取得相关同学授权；不要上传未公开研究数据和个人隐私。

### 更换负责人照片 / 邮箱

- 上传 `pi.jpg` 到 `assets/`。
- 找到 `principalInvestigator`，设置 `photo: 'assets/pi.jpg'`。
- 文件顶部设置 `email: '你的公开邮箱'`。
- 根据需要填入 `scholar`、`github`、`orcid` 等完整网址。

## 六、如何先在本地预览？

下载解压后双击 `index.html`，多数现代浏览器可直接浏览。建议使用 Chrome 或 Edge。如果浏览器限制本地文件行为，上线到 GitHub Pages 后可正常访问。

## 七、常见问题

- **中英文如何切换？**：点右上角“中文 / EN”。语言偏好保存在当前浏览器。
- **为什么新学生没有出现？**：核对 `people` 中是否使用有效的 `group` 值，检查逗号和括号。
- **为什么图片不显示？**：文件名大小写必须完全相同（如 `PI.jpg` 与 `pi.jpg` 不一样）。
- **为什么论文 DOI 不可点？**：`doi` 需填完整的 `https://doi.org/...` 链接。
- **可以用自己的域名吗？**：可以，后续在 GitHub Pages 设置 Custom domain，并调整 DNS。
- **需要买服务器吗？**：不需要，公开静态网站可使用 GitHub Pages。

官方指南：https://docs.github.com/en/pages/quickstart

## 八、上线前核对清单

- [ ] 邮箱填写为你希望公开的邮箱
- [ ] 上传本人公开头像，并确认对外展示许可
- [ ] 核对个人简介、研究方向和学校名称
- [ ] 核对所有论文的完整标题、作者、期刊、DOI
- [ ] 更新团队名单、教学资料和新闻内容
- [ ] 替换示意性素材，添加真实实验室照片
- [ ] 在电脑和手机上检查所有页面


## 新增：直接发布到 GitHub
请阅读 `README-后台管理.md`，打开 `editor.html`，使用仅授权本站仓库的 Fine-grained Token 直接发布。
