// 阿拉伯数字转换大写
export function numberParseChina(textIndex) {
  let newString = "";
  let newTextIndex = textIndex + 1 + "";

  function sum(value, index) {
    var newValue = "";
    if (textIndex === 9) {
      return !index ? "十" : "";
    }
    let isSeat = ~~textIndex > 9 && ~~textIndex < 19;
    switch (~~value) {
      case 1:
        newValue = !index ? (isSeat ? "" : "一") : "十一";
        break;
      case 2:
        newValue = !index ? (isSeat ? "" : "二") : "十二";
        break;
      case 3:
        newValue = !index ? (isSeat ? "" : "三") : "十三";
        break;
      case 4:
        newValue = !index ? (isSeat ? "" : "四") : "十四";
        break;
      case 5:
        newValue = !index ? (isSeat ? "" : "五") : "十五";
        break;
      case 6:
        newValue = !index ? (isSeat ? "" : "六") : "十六";
        break;
      case 7:
        newValue = !index ? (isSeat ? "" : "七") : "十七";
        break;
      case 8:
        newValue = !index ? (isSeat ? "" : "八") : "十八";
        break;
      case 9:
        newValue = !index ? (isSeat ? "" : "九") : "十九";
        break;
      case 0:
        newValue = "十";
        break;
      default:
        break;
    }
    return newValue;
  }

  for (let i = 0; i < newTextIndex.length; i++) {
    newString += sum(newTextIndex.substring(i, i + 1), i);
  }
  return newString;
}

/**
 * 金额千分位分割格式函数
 * @param {Number|String} vlaue 需要转化的金额字符串
 */
export function formatAmount(value) {
  //传入值不是数字直接返回0
  if (!value) return "0.00";
  const values = value.toString().split(".");
  // 整数部分
  let integerNum = values[0];
  // 小数部分
  let decimalNum = values[1] ? values[1] : "00";
  decimalNum = decimalNum.length === 1 ? decimalNum + 0 : decimalNum;
  //传入值小于1000不切割
  if (integerNum < 1000) {
    return `${integerNum}.${decimalNum}`;
  }
  const list = [];
  while (integerNum.length > 3) {
    // 倒序切割
    list.unshift(integerNum.slice(-3));
    integerNum = integerNum.slice(0, -3);
  }
  // 处理剩余长度
  list.unshift(integerNum);
  return `${list.join(",")}.${decimalNum}`;
}

/**
 * 金额转大写
 */
export function convertCurrency(money) {
  //汉字的数字
  var cnNums = new Array(
    "零",
    "壹",
    "贰",
    "叁",
    "肆",
    "伍",
    "陆",
    "柒",
    "捌",
    "玖"
  );
  //基本单位
  var cnIntRadice = new Array("", "拾", "佰", "仟");
  //对应整数部分扩展单位
  var cnIntUnits = new Array("", "万", "亿", "兆");
  //对应小数部分单位
  var cnDecUnits = new Array("角", "分", "毫", "厘");
  //整数金额时后面跟的字符
  var cnInteger = "整";
  //整型完以后的单位
  var cnIntLast = "元";
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = "";
  //分离金额后用的数组，预定义
  var parts;
  // 传入的参数为空情况
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    return "";
  }
  // 传入的参数为0情况
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  // 转为字符串
  money = money.toString();
  // indexOf 检测某字符在字符串中首次出现的位置 返回索引值（从0 开始） -1 代表无
  if (money.indexOf(".") == -1) {
    integerNum = money;
    decimalNum = "";
  } else {
    parts = money.split(".");
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //转换整数部分
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    let IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    // 最后+ 元
    chineseStr += cnIntLast;
  }
  // 转换小数部分
  if (decimalNum != "") {
    let decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1);
      if (n != "0") {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == "") {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == "") {
    chineseStr += cnInteger;
  }

  return chineseStr;
}
