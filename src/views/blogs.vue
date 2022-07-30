<template>
  <div id="blogs">
    <div id="connnet">
      <div id="author">
        <div id="b_a">
          <a-avatar
            v-if="my.msg != null"
            size="large"
            :src="this.$store.state.host[0] + '/' + my.msg.headP"
          >
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </div>

        <div id="b_details">
          <p v-if="my.msg != null">
            &nbsp;&nbsp;<a>{{ my.msg.userName }}</a>
          </p>
          <p v-if="my.msg != null">
            &nbsp;
            <span>发布于&nbsp;{{ my.msg.time.split(" ")[0] }}</span>
            &nbsp;
            <span
              ><a @click="show_folder"
                ><star-two-tone two-tone-color="#c4bd00" />
              </a>
              {{ my.msg.collect }}</span
            >
            &nbsp;
            <span> <eye-outlined />&nbsp;{{ my.msg.view }} </span>
          </p>
        </div>
        <div id="tob_fans" v-if="my.msg != null">
          <a-button v-if="my.msg.watch == 'true'" type="primary"
            >已关注</a-button
          >
          <a-button v-else-if="my.msg.watch == 'false'" type="primary"
            >关注</a-button
          >
        </div>
      </div>
      <div v-if="my.msg != null">
        <h1>{{ my.msg.title }}</h1>
      </div>
      <div id="myblogs"></div>
      <!-- 回复 -->
      <div id="reply">
        <span>
          <a-textarea
            v-model:value="value1"
            show-count
            :maxlength="100"
            allow-clear
          />
        </span>
        <span>
          <a-button type="primary" @click="push_reply">发布</a-button>
        </span>
      </div>
      <a-modal v-model:visible="folder_visible" :footer="null" :width="300">
        <a-radio-group v-model:value="checked">
          <a-radio
            v-for="(item, index) in folder"
            :key="index"
            :value="item.id"
            :style="{
              display: 'flex',
              height: '30px',
              lineHeight: '30px',
            }"
            >{{ item.folder }} <br
          /></a-radio>
        </a-radio-group>
        <div>
          <a-input-search
            style="width: 250px"
            v-model:value="now.name"
            enter-button="添加收藏夹"
            size="middle"
            @search="ed_folder"
          />
          <p></p>
          <a-button @click="ad_collect" type="primary">确定</a-button>
        </div>
      </a-modal>
      <!-- 留言板 -->
      <comm />
    </div>
  </div>
</template>

<script>
import { UserOutlined } from "@ant-design/icons-vue";
import { StarTwoTone, EyeOutlined } from "@ant-design/icons-vue";
import comm from "../components/comment.vue";
import { message } from "ant-design-vue";
export default {
  components: {
    UserOutlined,
    comm,
    StarTwoTone,
    EyeOutlined,
  },
  data() {
    return {
      now: { name: null },
      folder_visible: false,
      checked: null,
      value1: "",
      folder: [],
      my: { msg: null, txt: null },
    };
  },
  created() {
    const page_views=()=>{
      this.axios
      .post(this.$store.state.host[0] + "/blog_views", {
        id: this.$store.state.blogID,
        title: this.my.msg.title,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data[0].code == 0) {
         console.log('ye');
        }
      })
      .catch((e) => {
        console.log(e);
      });
    }
    this.if_view = setTimeout(() => {
      page_views()
    }, 3000);
    var b = this.$store.state.blogID;
    console.log(b);
    var account = 0;
    if (this.$store.state.lives) {
      account = this.$store.state.lives.Account;
    }
    this.axios
      .post(this.$store.state.host[0] + "/article_details", {
        id: b,
        account: account,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data[0].code == 0) {
          this.my.msg = res.data[1].msg[0];
          this.my.txt = res.data[2].text;
          var t = document.getElementById("myblogs");
          t.innerHTML = res.data[2].text;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  },
  methods: {
    // 一级留言
    push_reply() {
      if (this.$store.state.lives) {
        if (this.value == "") {
          message.info("不能为空");
        } else {
          this.axios
            .post(this.$store.state.host[0] + "/to_reply", {
              id: this.my.msg.id,
              account: this.$store.state.lives.Account,
              txt: this.value1,
              token:this.$store.state.lives.token
            })
            .then((res) => {
              console.log(res.data);
              if (res.data[0].code == 0) {
                message.info("回复成功");
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      } else {
        message.info("请登录");
      }
    },
    // 添加收藏夹
    ed_folder() {
      this.axios
        .post(this.$store.state.host[0] + "/add/folder", {
          name: this.now.name,
          account: this.$store.state.lives.Account,
          token:this.$store.state.lives.token
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            var d = res.data[1];
            this.folder.push(d);
            message.info("添加成功");
          } else if (res.data[0].code == 26) {
            message.info("名称重复");
          } else if (res.data[0].code == 32) {
            message.info("收藏夹最大数量");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 添加收藏
    ad_collect() {
      this.axios
        .post(this.$store.state.host[0] + "/ad_collect", {
          account: this.$store.state.lives.Account,
          blog_id: this.my.msg.id,
          folder_id: this.checked,
          token:this.$store.state.lives.token
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            message.info("添加成功");
          } else if (res.data[0].code == 26) {
            message.info("已添加");
          }
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(this.checked);
    },
    // 查询收藏夹
    show_folder() {
      if (this.$store.state.lives) {
        this.axios
          .post(this.$store.state.host[0] + "/find_folder", {
            account: this.$store.state.lives.Account,
            token:this.$store.state.lives.token
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              this.folder = res.data[1].msg;
            }
          })
          .catch((e) => {
            console.log(e);
          });
        this.folder_visible = !this.folder_visible;
      } else {
        message.info("请登录");
      }
    },
  },
  // 组件销毁
  beforeUnmount() {
    console.log("销毁");
    clearTimeout(this.if_view);
  },
  setup() {},
};
</script>

<style lang='less'>
#author {
  width: 900px;
  height: 50px;
  #b_details {
    float: left;
    p {
      margin-bottom: 0px;
    }
  }
  #b_a {
    float: left;
    margin-top: 5px;
  }
  #tob_fans {
    float: left;
    margin-top: 8px;
    margin-left: 300px;
  }
}
#reply {
  width: 900px;
}
#blogs {
  margin-top: 50px;
}
#connnet {
  width: 900px;
  margin: auto;
}
</style>