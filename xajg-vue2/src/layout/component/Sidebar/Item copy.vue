<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    iconPic: {
      type: String,
      default: "",
    },
    todoCount: {
      type: Number,
      default: 0,
    },
  },
  render(h, context) {
    let { icon, title, isRoot,todoCount } = context.props;
    const vnodes = [];
    if (icon) {
      // 带.默认是图片
      if (icon.indexOf(".") > -1) {
        vnodes.push(
          isRoot ? (
            <img class="icon-pic is_root_icon" src={icon} />
          ) : (
            <img class="icon-pic" src={icon} />
          )
        );
      } else {
        vnodes.push(<i class={"iconfont " + icon} />);
      }
    } else {
      // 无图标时默认展示叶子节点图标
      vnodes.push(<div class="icon-leaf"></div>);
    }

    if (title) {
      // 菜单不能超过四个字
      // if (title.length > 4) {
      //   title = title.substring(0, 4)
      // }
      if (isRoot) {
        // 代办数量
        if (todoCount && todoCount > 0) {
          if (todoCount > 99) {
            todoCount = 99
          }
          vnodes.push(
            <span slot="title" class="is_root title_span">
              {title}
              <div class="title_todo">
                {todoCount}
              </div>
            </span>
          );
        } else {
          vnodes.push(
            <span slot="title" class="is_root title_span">
              {title}
            </span>
          );
        }
      } else {
        // 代办数量
        if (todoCount && todoCount > 0) {
          if (todoCount > 99) {
            todoCount = 99
          }
          vnodes.push(
            <span slot="title" class="title_span">
              {title}
              <div class="title_todo">
                {todoCount}
              </div>
            </span>
          );
        } else {
          vnodes.push(
            <span slot="title" class="title_span">
              {title}
            </span>
          );
        }
      }
    }
    // console.log("vnodes", vnodes, h, context);
    return vnodes;
  },
};
</script>
