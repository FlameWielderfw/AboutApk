import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
// import { WidthType, BorderStyle, Document, Paragraph, Packer, TextRun } from "docx";
// import { saveAs } from 'file-saver';

/**
 * @param ele      要生成 pdf 的 DOM 元素（容器）
 * @param pdfName PDF文件生成后的文件名字
 * */
const downloadPDF = (ele, pdfName) => {
  const eleW = ele.offsetWidth;  // 获得该容器的宽
  const eleH = ele.offsetHeight;  // 获得该容器的高
  const eleOffsetTop = ele.offsetTop;  // 获得该容器到文档顶部的距离
  const eleOffsetLeft = ele.offsetLeft;  // 获得该容器到文档最左的距离
  const canvas = document.createElement("canvas");
  let abs = 0;
  const win_in = document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
  const win_out = window.innerWidth;  // 获得当前窗口的宽度（包含滚动条）
  if (win_out > win_in) {
    // abs = (win_o - win_i)/2;  // 获得滚动条长度的一半
    abs = (win_out - win_in)/2;  // 获得滚动条宽度的一半
    // console.log(a, '新abs');
  }
  canvas.width = eleW * 2;  // 将画布宽&&高放大两倍
  canvas.height = eleH * 2;
  const context = canvas.getContext("2d");
  context.scale(2, 2);
  context.translate(-eleOffsetLeft -abs, -eleOffsetTop);
  // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此
  // translate的时候，要把这个差值去掉
  // html2canvas(element).then( (canvas)=>{ //报错
  // html2canvas(element[0]).then( (canvas)=>{
  html2canvas( ele, {
    dpi: 300,
    scale: 3,
    // allowTaint: true,  // 允许 canvas 污染，allowTaint 参数要去掉，否则是无法通过 toDataURL 导出 canvas 数据的
    useCORS:true  //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
  }).then((canvas)=>{
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    // 一页 pdf 显示 html 页面生成的 canvas 高度;
    const pageHeight = contentWidth / 592.28 * 841.89;
    // 未生成 pdf 的 html 页面高度
    let leftHeight = contentHeight;
    // 页面偏移
    let position = 0;
    // a4 纸的尺寸 [595.28,841.89]，html 页面生成的 canvas 在 pdf 中图片的宽高
    const imgWidth = 595.28;
    const imgHeight = 595.28/contentWidth * contentHeight;
    const pageData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new JsPDF('', 'pt', 'a4');
    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //当内容未超过pdf一页显示的范围，无需分页
    if (leftHeight < pageHeight) {
      //在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
      pdf.addImage(pageData, 'JPEG', 0, 40, imgWidth, imgHeight);
      // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
    } else {  // 分页
      while(leftHeight > 0) {
        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;
        //避免添加空白页
        if(leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    //可动态生成
    pdf.save(pdfName);
  })
}

const downloadWord = (obj) => {
  // let doc = new Document();
  //
  // // Add paragraph in the document
  // let title = new Paragraph(`Detailed Report for ${obj.name}`).title().center();
  //
  // // To export into a .docx file
  // let packer = new Packer();
  //
  // packer.toBlob(doc).then(blob => {
  //   saveAs(blob, "detailed_report.docx");
  //   // using sweet alert for notification
  //   toast({
  //     type: 'success',
  //     title: 'Document created!'
  //   })
  // });
}

const OutputUtils = {
  downloadPDF: downloadPDF,
  downloadWord: downloadWord
}

export default OutputUtils
