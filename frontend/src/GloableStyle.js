import reset from "styled-reset";
import { createGlobalStyle } from "styled-components";

const GloableStyle = createGlobalStyle`
 ${reset}
  table, caption, tbody, tfoot, thead, tr, th, td{
   vertical-align:middle;
 }
 html{
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
   
    font-family:"PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
  }
`;
export default GloableStyle;
