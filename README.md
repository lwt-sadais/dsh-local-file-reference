# dsh-local-file-reference

为 DeepSeek Harness Desktop 会话输入框增加通用本地文件引用粘贴支持。

从资源管理器复制任意文件后，在会话输入框按 `Ctrl+V`（macOS 使用 `Command+V`）。插件通过 Desktop 的安全桥接接口取得文件的本地绝对路径，并在输入框上方显示可删除的文件引用卡片。发送时只把本地路径引用序列化进消息，不在浏览器中解析文件，也不会预先上传文件内容。

Agent 收到路径引用后，可按任务需要使用 `read`、`read_image` 或其他合适工具读取。文件必须在 Agent 运行时仍位于原路径，且该路径需要满足当前工作区和文件权限策略。

## 安装

### 在普通系统终端中安装

普通终端需要显式指定 DSH Desktop 使用的 `desktop` profile：

```sh
dsh plugin --profile desktop github:lwt-sadais/dsh-local-file-reference
```

### 在 DSH Desktop 的终端中安装

DSH Desktop 内置终端已自动使用 `desktop` profile，因此不需要添加 `--profile desktop`：

```sh
dsh plugin github:lwt-sadais/dsh-local-file-reference
```

安装完成后，重启 DSH Desktop 或重新启动对应的 DSH Web Host，使插件生效。
