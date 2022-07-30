<template>
  <a-config-provider :locale="zhCN">
    <div id="ap">
      <div id="searchHome">
        <a-input-search
          v-model:value="value"
          placeholder="input search text"
          enter-button
          @search="onSearch"
          style="width: 400px"
        />
      </div>

      <div id="top">
        <a-affix :offset-top="120" style="">
          <ul>
            <li>
              <a-button
                :ghost="true"
                type="primary"
                shape="circle"
                size="large"
                title="主页"
                @click="home"
              >
                <template #icon> <HomeOutlined /></template>
              </a-button>
              <!-- 头像 -->
              <a-avatar
                title="博客"
                @click="mesage('myblogs')"
                size="large"
                v-if="this.$store.state.lives"
                :src="
                  this.$store.state.host[0] +
                  '/' +
                  this.$store.state.lives.headP
                "
              />
              <!-- 登录按钮 -->
              <a-button
                :ghost="true"
                type="primary"
                shape="circle"
                size="large"
                title="登录"
                @click="
                  this.$store.state.lives == ''
                    ? (this.visible = true)
                    : (this.visible = false)
                "
                v-if="this.$store.state.lives == ''"
              >
                <template #icon>
                  <UserOutlined />
                </template>
              </a-button>
              <a-button
                :ghost="true"
                type="primary"
                shape="circle"
                size="large"
                title="个人资料"
                @click="mesage('myhome')"
              >
                <template #icon><AuditOutlined /></template>
              </a-button>

              <!-- 登录注册 -->
              <a-modal v-model:visible="visible" :footer="null" :width="300">
                <!-- 登录 -->
                <div v-if="this.switch.login">
                  <a-form
                    :model="tologin"
                    v-bind="layout"
                    name="login"
                    :rules="login_rules"
                    @submit="ulogin"
                  >
                    <a-form-item has-feedback label="账号" name="account">
                      <a-input v-model:value="tologin.account" />
                    </a-form-item>
                    <a-form-item has-feedback label="密码" name="pwd">
                      <a-input
                        v-model:value="tologin.pwd"
                        type="password"
                        autocomplete="off"
                      />
                    </a-form-item>
                    <div class="login-form-wrap">
                      <a class="login-form-forgot" @click="signOr('forget')"
                        >忘记密码</a
                      >
                    </div>

                    <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
                      <a-button type="primary" html-type="submit"
                        >登录</a-button
                      >
                      &nbsp;
                      <a-button type="primary" @click="signOr('sign')"
                        >注册</a-button
                      >
                    </a-form-item>
                  </a-form>
                </div>
                <!-- 忘记密码 -->
                <div v-if="this.switch.forget">
                  <a-form
                    :model="toforget"
                    v-bind="layout"
                    @submit="up()"
                    :rules="forget_rules"
                  >
                    <a-form-item label="邮箱" name="email">
                      <a-input v-model:value="toforget.email"></a-input>
                    </a-form-item>
                    <a-form-item label="验证码" name="code">
                      <a-input-search
                        v-model:value="toforget.code"
                        :enter-button="codeState"
                        @search="getCode(toforget.email)"
                      />
                    </a-form-item>
                    <a-form-item label="新密码" name="npwd">
                      <a-input
                        v-model:value="toforget.npwd"
                        type="password"
                      ></a-input>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
                      <a-button type="primary" html-type="submit"
                        >修改</a-button
                      >
                      &nbsp;
                      <a-button type="primary" @click="signOr('login')"
                        >登录</a-button
                      >
                    </a-form-item>
                  </a-form>
                </div>
                <!-- 注册 -->
                <div v-if="this.switch.sign">
                  <a-form
                    :rules="sgin_rules"
                    :model="tosign"
                    v-bind="layout"
                    @submit="usign"
                  >
                    <a-form-item has-feedback label="账号" name="account">
                      <a-input v-model:value="tosign.account" />
                    </a-form-item>
                    <a-form-item has-feedback label="密码" name="pwd">
                      <a-input
                        v-model:value="tosign.pwd"
                        type="password"
                        autocomplete="off"
                      />
                    </a-form-item>
                    <a-form-item has-feedback label="确认密码" name="npwd">
                      <a-input
                        v-model:value="tosign.npwd"
                        type="password"
                        autocomplete="off"
                      />
                    </a-form-item>
                    <a-form-item has-feedback label="邮箱" name="email">
                      <a-input v-model:value="tosign.email" />
                    </a-form-item>
                    <a-form-item label="验证码" name="code">
                      <a-input-search
                        v-model:value="tosign.code"
                        :enter-button="codeState"
                        @search="getCode(tosign.email)"
                      />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
                      <a-button type="primary" html-type="submit"
                        >注册</a-button
                      >
                      &nbsp;
                      <a-button type="primary" @click="signOr('login')"
                        >登录</a-button
                      >
                    </a-form-item>
                  </a-form>
                </div>
              </a-modal>

              <a-badge count="">
                <a-button
                  :ghost="true"
                  type="primary"
                  shape="circle"
                  size="large"
                  title="创作"
                  @click="mesage('editor')"
                >
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-badge>
              <a-button
                v-if="this.$store.state.lives != ''"
                :ghost="true"
                type="primary"
                shape="circle"
                size="large"
                title="退出"
                @click="mesage('out')"
              >
                <template #icon><LogoutOutlined /></template>
              </a-button>
            </li>
          </ul>
        </a-affix>
      </div>
      <a-back-top>
        <div class="ant-back-top-inner">UP</div>
      </a-back-top>
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
// import io from "socket.io-client";
import { message } from "ant-design-vue";
import { reactive } from "vue";
import { useStore } from "vuex";
import {
  HomeOutlined,
  AuditOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
  components: {
    HomeOutlined,
    AuditOutlined,
    EditOutlined,
    UserOutlined,
    LogoutOutlined,
  },
  data() {
    return {
      layout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 15,
        },
      },
      value: "",
      visible: false,
      switch: { login: true, sign: false, forget: false },
      toforget: { email: null, pwd: null, code: null, account: 0 },
      tologin: { account: null, pwd: null },

      tips: "",
      codeState: "获取",
      time: null,
    };
  },
  methods: {
    // 忘记密码
    up() {
      this.axios
        .post(this.$store.state.host[0] + "/up_pw", this.toforget)
        .then((res) => {
          if (res.data[0].code == 0) {
            message.info("修改成功");
            this.pwd_visible = false;
          } else if (res.data[0].code == 20) {
            message.info("验证码错误");
          }
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
          message.info("网络异常");
        });
    },
    // 验证码计时器
    mytime() {
      if (this.codeState != 0) {
        this.codeState--;
      } else {
        clearInterval(this.time);
        this.codeState = "获取";
      }
    },
    //登录注册切换
    signOr(val) {
      for (var i in this.switch) {
        this.switch[i] = false;
      }
      this.switch[val] = true;
    },
    //登录
    ulogin() {
      this.axios
        .post(this.$store.state.host[0] + "/login", this.tologin)
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 23) {
            message.info("账号或密码错误");
          } else if (res.data[0].code == 0) {
            message.info("登录成功");
            var msg = res.data[1].msg[0];
            console.log();
            this.visible = false;
            this.setCookie("session", msg.session);
            this.$store.state.lives = msg;
          } else {
            message.info("异常");
            console.log(res.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    //进入find页面
    onSearch() {
      if (this.value != "" && this.value.trim() != "") {
        this.$store.state.finds = this.value;
        this.$router.push({ path: "/finds" });
      } else {
        message.info("不能为空");
      }
    },
    //进入主页
    home() {
      this.$router.push({ path: "/" });
    },
    //登录判断
    mesage(router) {
      if (this.$store.state.lives == "") {
        message.info("请登录");
      } else {
        if (router == "editor") {
          this.$router.push({ path: "/editor" });
        } else if (router == "out") {
          this.setCookie("session", "");
          location.reload();
        } else if (router == "myblogs") {
          this.$store.state.blogID = "";
          if (this.$route.path != "/myCenter") {
            this.$router.push({ path: "/myCenter" });
          }
        } else if (router == "myhome") {
          this.$router.push({ path: "/personal" });
        }
      }
    },
    // 获取验证码
    getCode(val) {
      if (this.codeState != "获取") {
        message.info("请稍后");
      } else {
        this.axios
          .post(this.$store.state.host[0] + "/getcode", {
            email: val,
          })
          .then((res) => {
            if (res.data.states == 200) {
              message.info("获取成功");
              this.codeState = 60;
              this.time = setInterval(this.mytime, 1000);
            } else {
              message.info("获取失败");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },
  created() {
    console.log("渲染app");
    const cookie = this.getCookie("session");
    if (cookie != "" && cookie != undefined) {
      this.axios
        .post(this.$store.state.host[0] + "/checks", { session: cookie })
        .then((res) => {
          if (res.data[0].code == 0) {
            message.info("登录");
            this.$store.state.lives = res.data[1].msg[0];
          } else {
            message.info("异常");
            console.log(res.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    // if (this.$store.state.lives == "") {
    //   this.$store.state.socket = io(this.$store.state.socketPaht);
    //   console.log(this.$store.state.socket);
    //   this.$store.state.socket.on("pp", (data) => {
    //     console.log(data.msg);
    //   });
    // } else {
    // }
  },
  setup() {
    let getCookie;
    let setCookie;
    const tosign = reactive({
      account: null,
      pwd: null,
      npwd: null,
      code: null,
      email: null,
    });
    let store = useStore();
    getCookie = (cname) => {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    };
    setCookie = (cname, cvalue) => {
      var d = new Date();
      d.setTime(d.getTime() + store.state.cookied * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toGMTString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    //注册
    const usign = () => {
      this.axios
        .post(store.state.host[0] + "/sign", tosign)
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            message.info("注册成功");
          } else if (res.data[0].code == 20) {
            message.info("邮箱存在");
          } else if (res.data[0].code == 21) {
            message.info("账号存在");
          }
        })
        .catch((e) => {
          console.log(e);
          message.info("网络异常");
        });
    };
    // 登录表单验证
    const login_account = async (_rule, value) => {
      var num = /^\d+$/;
      if (!value) {
        return Promise.reject("请输入账号");
      } else if (!num.test(value)) {
        return Promise.reject("请输入数字");
      }
    };
    const login_pwd = async (_rule, value) => {
      var pwd = /^[a-z0-9]+$/i;
      if (!value) {
        return Promise.reject("请输入密码");
      } else if (!pwd.test(value)) {
        return Promise.reject("请输入字母或数字");
      } else if (value.length < 8) {
        return Promise.reject("长度大于等于8");
      }
    };
    const login_rules = {
      account: [
        {
          require: true,
          validator: login_account,
          trigger: "change",
        },
      ],
      pwd: [{ require: true, validator: login_pwd, trigger: "change" }],
    };
    // 注册验证
    const sign_checkpwd = async (_rule, value) => {
      var pwd = /^[a-z0-9]+$/i;
      if (!value) {
        return Promise.reject("请输入密码");
      } else if (!pwd.test(value)) {
        return Promise.reject("请输入字母或数字");
      } else if (value.length < 8) {
        return Promise.reject("长度大于等于8");
      } else if (tosign.pwd != value) {
        return Promise.reject("密码不一致");
      }
    };
    const sign_email = async (_rule, value) => {
      var em = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      console.log(value);
      if (!value) {
        return Promise.reject("不能为空");
      } else if (!em.test(value)) {
        return Promise.reject("邮箱格式错误");
      }
    };
    const sign_code = async (_rule, value) => {
      var num = /^\d+$/;
      if (!value) {
        return Promise.reject("不能为空");
      } else if (!num.test(value)) {
        return Promise.reject("请输入数字");
      }
    };
    const sgin_rules = {
      account: [
        {
          require: true,
          validator: login_account,
          trigger: "change",
        },
      ],
      pwd: [{ require: true, validator: login_pwd, trigger: "change" }],
      npwd: [{ require: true, validator: sign_checkpwd, trigger: "change" }],
      email: [{ require: true, validator: sign_email, trigger: "change" }],
      code: [{ require: true, validator: sign_code, trigger: "change" }],
    };
    const forget_rules = {
      npwd: [{ require: true, validator: login_pwd, trigger: "change" }],
      email: [{ require: true, validator: sign_email, trigger: "change" }],
      code: [{ require: true, validator: sign_code, trigger: "change" }],
    };
    return {
      forget_rules,
      usign,
      tosign,
      sgin_rules,
      login_rules,
      setCookie,
      getCookie,
      zhCN,
    };
  },
};
</script>

<style lang='less'>
.login-form-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.login-form-forgot {
  margin-bottom: 10px;
  margin-left: 20px;
}
#searchHome {
  height: 50px;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  .ant-input-search {
    margin-top: 10px;
  }
}
#top {
  position: absolute;
  margin-top: 80px;
  right: 100px;
  .ant-avatar:hover {
    cursor: pointer;
  }
  ul {
    li {
      list-style-type: none;
      display: block;
      width: 50px;
      height: 20px;
      float: left;
      text-align: center;
      line-height: 50px;
      // p {
      //   color: blanchedalmond;
      // }
    }
  }
}
</style>
