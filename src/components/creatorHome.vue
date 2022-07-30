<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" @change="change">
      <a-tab-pane key="1" tab="文章">
        <a-list item-layout="vertical" :data-source="blogs">
          <template #loadMore>
            <div
              :style="{
                textAlign: 'center',
                marginTop: '12px',
                height: '32px',
                lineHeight: '32px',
              }"
            >
              <a-button v-if="blogs_more" @click="loadMore('blog')"
                >更多</a-button
              >
            </div>
          </template>
          <template #renderItem="{ item }">
            <a-list-item>
              <template #extra>
                <a @click="editer(item.id)">编辑</a>&nbsp;
                <a @click="del(item.id)">删除</a>
              </template>
              <template #actions>
                <span>
                  <eye-outlined />
                  {{ item.view }}
                </span>
              </template>
              <a-list-item-meta :description="item.brief">
                <template #title>
                  <a @click="get_blog(item.id)">{{ item.title }}</a>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>

      <a-tab-pane key="2" tab="收藏">
        <!-- <a style="margin: 0 auto" @click="show">添加收藏夹</a> -->
        <a-tabs
          type="editable-card"
          @change="folder_change"
          v-model:activeKey="folder_activeKey"
          @edit="onEdit"
        >
          <a-tab-pane
            v-for="(item, index) in folder"
            :key="index"
            :closable="true"
          >
            <template #tab>
              {{ item.folder }}
            </template>
          </a-tab-pane>
          <!-- <template #rightExtra> <a >编辑</a> </template> -->
        </a-tabs>

        <div>
          <a-input-search
          style="width: 200px;"
            v-model:value="now.name"
            enter-button="重命名"
            size="middle"
            @search="ed_folder"
          />
          <a-list item-layout="vertical" :data-source="collect">
            <template #loadMore>
              <div
                :style="{
                  textAlign: 'center',
                  marginTop: '12px',
                  height: '32px',
                  lineHeight: '32px',
                }"
              >
                <a-button v-if="collect_more" @click="loadMore('collect')"
                  >更多</a-button
                >
              </div>
            </template>
            <template #renderItem="{ item }">
              <a-list-item>
                <template #extra>
                  <a @click="del_collet(item.id)">删除</a>
                </template>
                <a-list-item-meta :description="item.brief">
                  <template #title>
                    <a @click="get_blog(item.id)">{{ item.title }}</a>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-modal v-model:visible="folder_visible" :footer="null" :width="300">
      <a-form v-bind="layout" @submit="add" :model="ad" :rules="rules">
        <a-form-item label="文件夹" name="folder">
          <a-input v-model:value="ad.folder"></a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-button type="primary" html-type="submit">添加</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { EyeOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
export default {
  components: {
    EyeOutlined,
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
      now: { name: null, index: null },
      collect_page: 0,
      collect_more: false,
      collect: [],
      ad: { folder: null },
      folder_visible: false,
      folder: [],
      activeKey: "1",
      folder_activeKey: "1",
      blog_page: 0,
      blogs_more: false,
      blogs: [],
    };
  },
  created() {},
  methods: {
    // 收藏
    del_collet(val) {
      this.axios
        .post(this.$store.state.host[0] + "/del/my_collect", {
          id: val,
          account: this.$store.state.lives.Account,
          token:this.$store.state.lives.token
        })
        .then((res) => {
          if (res.data[0].code == 0) {
            message.info("删除成功");
            for (var i in this.collect) {
              if (this.collect[i].id == val) {
                this.collect.splice(i, 1);
              }
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    ed_folder() {
      var n = this.now.name;
      this.axios
        .post(this.$store.state.host[0] + "/ed_folder", {
          old_name: this.folder[this.now.index].folder,
          name: n,
          account: this.$store.state.lives.Account,
          token:this.$store.state.lives.token
        })
        .then((res) => {
          if (res.data[0].code == 0) {
            this.folder[this.now.index].folder = n;
            message.info("修改成功");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    onEdit(targetKey, action) {
      if (action === "add") {
        this.show();
      } else {
        this.remove(targetKey);
      }
    },
    remove(val) {
      var id = this.folder[val].id;
      this.axios
        .post(this.$store.state.host[0] + "/del/my_folder", {
          id: id,
          account: this.$store.state.lives.Account,
          token:this.$store.state.lives.token
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            this.folder.splice(val, 1);
            message.info("删除成功");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    folder_change(next) {
      if (next == "next") {
        this.collect_page += 10;
      } else {
        this.collect_page = 0;
      }
      this.now.name = this.folder[this.folder_activeKey].folder;
      this.now.index = this.folder_activeKey;
      var id = this.folder[this.folder_activeKey].id;
      this.axios
        .post(this.$store.state.host[0] + "/find_collect", {
          page: this.collect_page,
          account: this.$store.state.lives.Account,
          id: id,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            this.collect = res.data[1].msg;
            var len = Object.keys(res.data[1].msg).length;
            if (len < 10) {
              this.collect_more = false;
            } else {
              this.collect_more = true;
            }
          }
          if (res.data[0].code == 1) {
            this.collect_more = false;
            this.collect = [];
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    get_folder() {
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
    },
    add() {
      this.axios
        .post(this.$store.state.host[0] + "/add/folder", {
          name: this.ad.folder,
          account: this.$store.state.lives.Account,
          token: this.$store.state.lives.token
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            this.folder.push({ folder: this.ad.folder });
            message.info("添加成功");
            this.folder_visible = false;
          }else if(res.data[0].code == 26){
            message.info('名称重复')
          }else if(res.data[0].code == 26){
            message.info('收藏夹最大数量')
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    show() {
      this.folder_visible = !this.folder_visible;
    },
    get_blog(){},
    //文章
    find_blog(val, next) {
      if (next == "next") {
        this.blog_page += 10;
      } else {
        this.blog_page = 0;
      }
      this.axios
        .post(this.$store.state.host[0] + "/find_my_b", {
          page: this.blog_page,
          account: this.$store.state.lives.Account,
          find: val,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            this.blogs = res.data[1].msg;
            var len = Object.keys(res.data[1].msg).length;
            if (len < 10) {
              this.blogs_more = false;
            } else {
              this.blogs_more = true;
            }
          }
          if (res.data[0].code == 1) {
            this.blogs_more = false;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    loadMore(val) {
      if (val == "blog") {
        this.find_blog("", "next");
      }
      if (val == "collect") {
        this.folder_change("next");
      }
    },
    change() {
      switch (this.activeKey) {
        case "1":
          this.find_blog("", "");
          break;
        case "2":
          this.get_folder();
          break;
      }
    },
    editer(id) {
      this.$store.state.get_blog = id;
      this.$router.push({ path: "/editor" });
    },
    del(id) {
      this.axios
        .post(this.$store.state.host[0] + "/del/my_blog", {
          id: id,
          account:this.$store.state.lives.Account,
          token:this.$store.state.lives.token
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            message.info("删除成功");
            for (var i in this.blogs) {
              if (this.blogs[i].id == id) {
                this.blogs.splice(i, 1);
              }
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  setup() {
    const f = async (_rule, value) => {
      console.log(value);
      if (value == "") {
        return Promise.reject("不能为空");
      }
    };
    const rules = {
      folder: [
        {
          require: true,
          validator: f,
          trigger: "change",
        },
      ],
    };
    return {
      rules,
    };
  },
};
</script>

<style lang='less'>
</style>