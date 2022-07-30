<template>
  <div>
    <div id="perd">
      <a-tabs v-model:activeKey="activeKey" tabPosition="left"  @change="change">
        <a-tab-pane key="1">
          <template #tab>
            <solution-outlined />
            个人资料
          </template>
          <div>
            <a-upload
              :data="{ account: this.$store.state.lives.Account,token:this.$store.state.lives.token }"
              :max-count="1"
              :show-upload-list="false"
              class="avatar-uploader"
              list-type="picture-card"
              name="file"
              :action="this.$store.state.host[0] + '/upimg'"
              @change="handleChange"
              :before-upload="beforeUpload"
            >
              <a-avatar
                :size="64"
                :src="
                  this.$store.state.host[0] +
                  '/' +
                  this.$store.state.lives.headP
                "
                alt="avatar"
              />
            </a-upload>

            <a-form
              :model="my_data"
              v-bind="layout"
              @submit="sub_my"
              :rules="login_rules"
            >
              <a-form-item label="用户名" name="user">
                <a-input v-model:value="my_data.name"></a-input>
              </a-form-item>
              <a-form-item label="账号" name="account">
                <span>{{ my_data.account }}</span>
              </a-form-item>
              <a-form-item label="签名" name="sgin">
                <a-textarea
                  style="width: 200px"
                  v-model:value="my_data.sign"
                  show-count
                  :maxlength="30"
                />
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
                <a-button type="primary" html-type="submit">保存</a-button>
              </a-form-item>
            </a-form>
            兴趣 :<a-tag
              :closable="0 == 0"
              v-for="(item, index) in tags"
              :key="index"
              @close="handleClose(item)"
              >{{ item }}</a-tag
            >
            <a-input
              ref="inputRef"
              v-if="inputVisible"
              v-model:value="inputValue"
              type="text"
              size="small"
              :style="{ width: '78px' }"
              @blur="handleInputConfirm"
              @keyup.enter="handleInputConfirm"
            /><a-tag
              v-else
              style="background: #fff; border-style: dashed"
              @click="showInput"
            >
              <plus-outlined />
              New Tag
            </a-tag>
          </div>
        </a-tab-pane>

        <a-tab-pane key="2" force-render>
          <template #tab>
            <setting-outlined />
            账号设置
          </template>
          邮箱：<a>{{ this.$store.state.lives.Email }}</a
          ><a-button @click="open('email')">重置</a-button>
          <p></p>
          密码<a-button @click="open('pwd')">重置</a-button>
        </a-tab-pane>
        <a-tab-pane key="3" force-render>
          <template #tab>
            <table-outlined />
            内容管理
          </template>
          <creator ref="my" />
        </a-tab-pane>
      </a-tabs>
    </div>

    <a-modal v-model:visible="email_visible" :footer="null" :width="300">
      <a-form
        :model="up_email"
        v-bind="account_layout"
        @submit="up('email')"
        :rules="forget_rules"
      >
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="toforget.email"></a-input>
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <a-input-search
            v-model:value="toforget.code"
            :enter-button="codeState"
            @search="getCode"
          />
        </a-form-item>
        <a-form-item label="新邮箱" name="email">
          <a-input v-model:value="toforget.npwd"></a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-button type="primary" html-type="submit">修改</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="pwd_visible" :footer="null" :width="300">
      <a-form
        :model="toforget"
        v-bind="account_layout"
        @submit="up('pwd')"
        :rules="forget_rules"
      >
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="toforget.email"></a-input>
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <a-input-search
            v-model:value="toforget.code"
            :enter-button="codeState"
            @search="getCode"
          />
        </a-form-item>
        <a-form-item label="新密码" name="npwd">
          <a-input v-model:value="toforget.npwd"></a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-button type="primary" html-type="submit">修改</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { setCookie } from "../api/cookie.js";
import {
  SolutionOutlined,
  SettingOutlined,
  TableOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import { ref, reactive, toRefs, nextTick, getCurrentInstance } from "vue";
import { message } from "ant-design-vue";
import creator from "../components/creatorHome.vue";
import { useStore } from "vuex";
export default {
  components: {
    SolutionOutlined,
    SettingOutlined,
    TableOutlined,
    PlusOutlined,
    creator,
  },
  data() {
    return {
      codeState: "获取",
      account_layout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 15,
        },
      },
      toforget: { email: null, pwd: null, code: null, account: null,token:this.$store.state.lives.token },
      up_email: { email: null, new_email: null, code: null, account: null,token:this.$store.state.lives.token },
      email_visible: false,
      pwd_visible: false,
      layout: {
        labelCol: {
          span: 2,
        },
        wrapperCol: {
          span: 18,
        },
      },
      fileList: [],
      activeKey: "1",
      my_data: { name: null, sign: null, account: null ,token:this.$store.state.lives.token},
    };
  },
  created() {
    if (this.$store.state.lives) {
      var v = this.$store.state.lives;
      this.my_data.name = v.userName;
      this.my_data.sign = v.sign;
      this.my_data.account = v.Account;
    } else {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    change(){
      if(this.activeKey==3){
        this.$refs.my.find_blog('','')
      }
    },
    getCode() {
      if (this.codeState != "获取") {
        message.info("请稍后");
      } else {
        this.axios
          .post(this.$store.state.host[0] + "/getcode", {
            email: this.toforget.email,
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
    mytime() {
      if (this.codeState != 0) {
        this.codeState--;
      } else {
        clearInterval(this.time);
        this.codeState = "获取";
      }
    },
    sub_my() {
      
      this.axios
        .post(this.$store.state.host[0] + "/up_pl", this.my_data)
        .then((res) => {
          if (res.data[0].code == 0) {
            message.info("修改成功");
          }
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
          message.info("网络异常");
        });
    },
    //头像
    handleChange(info) {
      if (info.file.status === "done") {
        if (info.file.response[0]["code"] == 0) {
          message.info("修改成功", 1);
        }
      }

      if (info.file.status === "error") {
        message.error("上传错误");
      }
    },
    // 图片检测
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        message.error("您只能上传JPG文件!");
      }

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        message.error("图片必须小于2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    open(val) {
      if (val == "email") {
        this.email_visible = true;
        this.pwd_visible = false;
      } else {
        this.pwd_visible = true;
        this.email_visible = false;
      }
    },
    up(val) {
      let data = null;
      if (val == "email") {
        this.up_email.account = this.$store.state.lives.Account;
        data = this.up_email;
        this.axios
          .post(this.$store.state.host[0] + "/up_em", data)
          .then((res) => {
            if (res.data[0].code == 0) {
              message.info("修改成功");
              this.email_visible = false;
            }else if(res.data[0].code == 22){
              message.info("验证码错误");
            }else if(res.data[0].code == 20){
              message.info("邮箱已绑定");
            }

            console.log(res.data);
          })
          .catch((e) => {
            console.log(e);
            message.info("网络异常");
          });
      } else {
        this.toforget.account = this.$store.state.lives.Account;
        data = this.toforget;
        this.axios
          .post(this.$store.state.host[0] + "/up_pw", this.toforget)
          .then((res) => {
            if (res.data[0].code == 0) {
              message.info("修改成功");
              this.pwd_visible = false;
              setCookie("session", "", 30);
              location.reload();
            }else if(res.data[0].code == 20){
              message.info("验证码错误");
            }
            console.log(res.data);
          })
          .catch((e) => {
            console.log(e);
            message.info("网络异常");
          });
      }
    },
  },
  setup() {
    const store = useStore();
    const global = getCurrentInstance();
    const axios = global.appContext.config.globalProperties.axios;
    const login_name = async (_rule, value) => {
      var num = /^\d+$/;
      if (!value) {
        return Promise.reject("请输入账号");
      } else if (!num.test(value)) {
        return Promise.reject("请输入数字");
      }
    };
    const login_rules = {
      account: [
        {
          require: true,
          validator: login_name,
          trigger: "change",
        },
      ],
    };
    // 兴趣标签
    const inputRef = ref();
    const state = reactive({
      tags: [],
      inputVisible: false,
      inputValue: "",
    });
    // 查询标签
    const get_tag = () => {
      axios
        .post(store.state.host[0] + "/find_label", {
          account: store.state.lives.Account,
          token:store.state.lives.token
        })
        .then((res) => {
          if (res.data[0].code == 0) {
            state.tags = res.data[1].msg;
          }
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
          message.info("网络异常");
        });
    };
    get_tag();
    // 删除标签
    const handleClose = (removedTag) => {
      console.log(removedTag);
      axios
        .post(store.state.host[0] + "/del_label", {
          account: store.state.lives.Account,
          name: removedTag,
          token:store.state.lives.token
        })
        .then((res) => {
          if (res.data[0].code == 0) {
            const tags = state.tags.filter((tag) => tag !== removedTag);
            console.log(tags);
            state.tags = tags;
            message.info("删除成功", 1);
          }
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
          message.info("网络异常");
        });
    };
    // 输入
    const showInput = () => {
      state.inputVisible = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    };
    // 添加标签
    const handleInputConfirm = () => {
      const inputValue = state.inputValue;
      let tags = state.tags;
      axios
        .post(store.state.host[0] + "/add_label", {
          account: store.state.lives.Account,
          tag: inputValue,
          token:store.state.lives.token
        })
        .then((res) => {
          if (res.data[0].code == 0) {
            if (inputValue && tags.indexOf(inputValue) === -1) {
              tags = [...tags, inputValue];
            }

            console.log(tags);
            Object.assign(state, {
              tags,
              inputVisible: false,
              inputValue: "",
            });
            message.info("添加成功", 1);
          }
          console.log(res.data);
        })
        .catch((e) => {
          console.log(e);
          message.info("网络异常");
        });
    };
    const sign_email = async (_rule, value) => {
      var em = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
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
    const pwd = async (_rule, value) => {
      var pwd = /^[a-z0-9]+$/i;
      if (!value) {
        return Promise.reject("请输入密码");
      } else if (!pwd.test(value)) {
        return Promise.reject("请输入字母或数字");
      } else if (value.length < 8) {
        return Promise.reject("长度大于等于8");
      }
    };
    const forget_rules = {
      npwd: [{ require: true, validator: pwd, trigger: "change" }],
      email: [{ require: true, validator: sign_email, trigger: "change" }],
      code: [{ require: true, validator: sign_code, trigger: "change" }],
    };
    return {
      forget_rules,
      login_rules,
      ...toRefs(state),
      handleClose,
      showInput,
      handleInputConfirm,
      inputRef,
    };
  },
};
</script>

<style lang="less">
#perd {
  margin: auto;
  margin-top: 50px;
  width: 900px;
  .ant-input {
    width: 200px;
  }
}
</style>>

