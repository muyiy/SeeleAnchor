
# 数据结构

- 节点 Nodes
  - **address**
  - network
  - parent network
  - index(0,1,2,3,4)
- 账户 Accounts
  - **public key**
  - network
  - parent public key
  - parent network
  - keyfile name
  - keyfile content
  - privilege
- 交易 Transactions
  - **transaction**
  - network
  - timestamp
- 子链 Subchains
  - **address**
  - network
  - parent network

# 界面设计

- 主界面: 默认节点面板
  - 节点 ±节点
  - 账户 ±账户
  - 子链 ±子链
  - 合约 x
  - 设置 x
- 节点面板:
  - 地址
- 账户面板: 账户列表 x
  - 交易 制作交易, 交易历史, 账户详情 x
  - 子链 x
  - 合约 x
  - 其它 x
- 子链面板: 子链选择, 账户列表
  - 交易页 制作交易, 交易历史, 账户详情
  - 进出页
  - 提交页
  - 权限页
- 合约面板 x
- 设置面板 x
- 交易页
- 进出页
  - request amount, privilege
  - request satatus:
    - request exit, enter (combine or overwrite)
    - executing early exit
    - comfirming early exit
    - comfirmed exit, enter (with remove)
- 提交页
  - relay method()
  - master account passwords
  - parent account password
- 权限页
  - name, address,
  - destroy/revive
  - info
    - operators/owners : []
    - static Nodes : []
    - total deposit :
    - contract balance :
    - active :

# 常用词汇

- 部署 Deploy: **上传** 合约到主网, 通过交易完成
- 调用 Employ: **读写** 主网合约, 通过交易完成
- 呼叫 Call: **读** 主网合约, 直接向主网请求
- 创建者 Creator: 控制子链部署和解散, 控制权限
- 操作者 Operator: 负责提交挑战回应回滚, 发收币等运营工作
- 检验者 Verifier: 子链里的投票者
- 用户 User
- 提交 Relay
- 挑战 Challenge
- 回应 Respond
- 回滚 Revert
- 发币地址 Mint Address: 操作者持有
- 收币地址 Melt Address: 操作者持有
- 回滚地址 Revert Address: 操作者持有
- 钥文 Keyfile

# 使用流程

0. 启动 //创建者
  0. 配置发币,收币,回滚,投票地址, 节点地址
  0. gui和terminal工具都行
  0. 一键启动
0. 部署 //创建者
  0. 终端
    0. 初始操作者们在主链上打币, 生成主+子链地址
    0. 创建子链 **发币**, **收币**, **回滚** 的地址+钥文
    0. 设置子链配置文档, 启动节点
    0. 按量用发币地址给操作者们检验权限和预订的子链余额
  0. [节点-面板] 增加网络(节点地址, 网络名称)
  0. [账户-面板] 创建 创建者 主链账户
  0. [子链-面板]
    - 选择子链(来自节点网络)
    - 选择创建者主链账户, 创建或导入子链账户
    - [权限-面板2] 部署
        - 手动填写: 挑战时长, 确认时长等等
        - 自动填写: 节点地址, 初始操作者等等
        - 一键部署: 生成地址和应用二进制接口文档
0. 订阅 //操作者, 使用者
  0. [节点-面板] 增加网络(节点地址, 网络名称)
  0. [账户-面板] 操作者 主链账户
  0. [子链-面板]
    - 选择子链(来自节点网络)
    - 选择操作者主链账户, 创建或导入子链账户
    - [权限-面板2] 订阅
0. 进出 //操作者, 使用者
  0. [节点-面板] 增加网络(节点地址, 网络名称)
  0. [账户-面板] 操作者 主链账户
  0. [子链-面板]
    - 选择子链(来自节点网络)
    - 选择操作者主链账户, 创建或导入子链账户
    - [权限-面板2] 订阅
    - [子链-面板] [进出-面板2]
0. 交易
  0. [子链-面板] [交易-面板2] 进入或退出
0. 维护
  0. [子链-面板] [提交-面板2] 挑战, 自动化提交, 自动化回滚
0. 注销
  0. [子链-面板] [权限-面板2] 注销

# 工作进度

### 1. Must

最大屏时变成两列节点,账户,

### 2. TODO

- 节点的上方操作点
- 增加节点的前段代码
- 自动刷新的前段代码

### 3. DONE

- 节点显示: 按片数显示
- 删除节点前段代码
- 删除节点的后端代码
- 节点显示: 按片数次序显示
- 节点数据初始化后端代码
- 节点增加的后端代码

### 4. Nice

增加地址时: 不允许重复地址
填写表格时: 有备选, dropdown, 有更短的单选
地址清理和地址增加时: 重复情况会按歧视链清除

### 5. Note
