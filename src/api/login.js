import axios from "axios";
import { callSuccess, callError, callInfo } from "@/api/index";

export async function searchArticle(data) {
  try {
    const response = await axios.post('/work/pageArticleEs', data);
    if (response.status === 200) {
      if (response.data.data == null)
        callInfo('暂无相关内容，换个关键词吧~')
      else
        callSuccess('查询论文成功');
      return response.data.data;
    } else {
      callInfo('暂无数据');
      return [];
    }
  } catch (error) {
    callError('网络错误');
    return [];
  }
}